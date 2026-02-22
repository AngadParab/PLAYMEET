import Leaderboard from '../../models/leaderboardModel.js';
import User from '../../models/userModel.js';
import Event from '../../models/eventModel.js';

// Get leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const {
      category = "overall",
      page = 1,
      limit = 50
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = {};
    if (category === "esports") {
      query = { "esportsProfile.gamerTag": { $exists: true, $ne: "" } };
    } else if (category === "athletes") {
      query = { "athleteProfile": { $exists: true } };
    }

    const users = await User.find(query)
      .select("-password")
      .populate("participatedEvents")
      .populate("createdEvents")
      .sort({ lifetimePoints: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const filteredUsers = users.filter(u => u.role !== "admin");

    const leaderboardWithRanks = filteredUsers.map((user, index) => {
      const points = user.lifetimePoints || 0;
      return {
        _id: user._id,
        user: {
          _id: user._id,
          name: user.name,
          username: user.username,
          avatar: user.avatar
        },
        points: points,
        rank: skip + index + 1,
        level: { current: Math.floor(points / 100) + 1, experience: points % 100, nextLevelExp: 100 },
        eventsParticipated: user.participatedEvents?.length || 0,
        eventsCreated: user.createdEvents?.length || 0,
        streak: { current: 0, longest: 0 },
        isCurrentUser: user._id.toString() === req.user?.id
      };
    });

    const total = await User.countDocuments({ ...query, role: { $ne: "admin" } });

    let currentUserPosition = null;
    if (req.user) {
      const currUser = await User.findById(req.user.id).populate("participatedEvents").populate("createdEvents");
      if (currUser && currUser.role !== "admin") {
        const userRank = await User.countDocuments({
          ...query,
          role: { $ne: "admin" },
          lifetimePoints: { $gt: currUser.lifetimePoints || 0 }
        }) + 1;

        currentUserPosition = {
          _id: currUser._id,
          user: { _id: currUser._id, name: currUser.name, avatar: currUser.avatar, username: currUser.username },
          points: currUser.lifetimePoints || 0,
          rank: userRank,
          level: { current: Math.floor((currUser.lifetimePoints || 0) / 100) + 1, experience: (currUser.lifetimePoints || 0) % 100, nextLevelExp: 100 },
          eventsParticipated: currUser.participatedEvents?.length || 0,
          eventsCreated: currUser.createdEvents?.length || 0,
          isCurrentUser: true
        };
      }
    }

    res.json({
      success: true,
      data: leaderboardWithRanks,
      currentUserPosition,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)) || 1,
        total,
        hasNext: parseInt(page) < Math.ceil(total / parseInt(limit)),
        hasPrev: parseInt(page) > 1
      },
      stats: { totalParticipants: total, category }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const points = user.lifetimePoints || 0;
    const categories = ["overall", "athletes", "esports"];

    const statsWithRanks = await Promise.all(
      categories.map(async (category) => {
        let query = { role: { $ne: "admin" } };
        if (category === "esports") {
          query["esportsProfile.gamerTag"] = { $exists: true, $ne: "" };
        } else if (category === "athletes") {
          query["athleteProfile"] = { $exists: true };
        }

        const rank = await User.countDocuments({
          ...query,
          lifetimePoints: { $gt: points }
        }) + 1;

        return {
          user: { _id: userId },
          category,
          points,
          rank,
          level: { current: Math.floor(points / 100) + 1, experience: points % 100, nextLevelExp: 100 }
        };
      })
    );

    res.json({ success: true, data: statsWithRanks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user points (called from event participation)
export const updateUserPoints = async (userId, category, pointsToAdd, action) => {
  try {
    // Update category-specific stats
    let categoryStats = await Leaderboard.findOne({ user: userId, category });
    if (!categoryStats) {
      categoryStats = new Leaderboard({ user: userId, category });
    }

    categoryStats.points += pointsToAdd;

    // Update action-specific counts
    switch (action) {
      case "event_participation":
        categoryStats.eventsParticipated += 1;
        break;
      case "event_creation":
        categoryStats.eventsCreated += 1;
        break;
      case "event_win":
        categoryStats.eventsWon += 1;
        break;
    }

    // Update level
    while (categoryStats.level.experience >= categoryStats.level.nextLevelExp) {
      categoryStats.level.experience -= categoryStats.level.nextLevelExp;
      categoryStats.level.current += 1;
      categoryStats.level.nextLevelExp = Math.floor(categoryStats.level.nextLevelExp * 1.5);
    }
    categoryStats.level.experience += pointsToAdd;

    // Update streak
    const today = new Date();
    const lastActivity = categoryStats.streak.lastActivity;

    if (!lastActivity || !isSameDay(today, lastActivity)) {
      if (lastActivity && isConsecutiveDay(today, lastActivity)) {
        categoryStats.streak.current += 1;
        if (categoryStats.streak.current > categoryStats.streak.longest) {
          categoryStats.streak.longest = categoryStats.streak.current;
        }
      } else if (!lastActivity || !isConsecutiveDay(today, lastActivity)) {
        categoryStats.streak.current = 1;
      }
      categoryStats.streak.lastActivity = today;
    }

    await categoryStats.save();

    // Update overall stats
    let overallStats = await Leaderboard.findOne({ user: userId, category: "overall" });
    if (!overallStats) {
      overallStats = new Leaderboard({ user: userId, category: "overall" });
    }

    overallStats.points += pointsToAdd;
    switch (action) {
      case "event_participation":
        overallStats.eventsParticipated += 1;
        break;
      case "event_creation":
        overallStats.eventsCreated += 1;
        break;
      case "event_win":
        overallStats.eventsWon += 1;
        break;
    }

    await overallStats.save();

    return { categoryStats, overallStats };
  } catch (error) {
    console.error("Error updating user points:", error);
    throw error;
  }
};

// Helper functions
function isSameDay(date1, date2) {
  return date1.toDateString() === date2.toDateString();
}

function isConsecutiveDay(today, lastActivity) {
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(yesterday, lastActivity);
}

// Get achievements
export const getAchievements = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;

    const userStats = await Leaderboard.find({ user: userId })
      .populate("user", "name avatar username");

    const allAchievements = userStats.reduce((acc, stat) => {
      return [...acc, ...stat.achievements];
    }, []);

    // Sort by earned date
    allAchievements.sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt));

    res.json({
      success: true,
      data: allAchievements,
      total: allAchievements.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching achievements",
      error: error.message
    });
  }
};

// Get leaderboard categories
export const getCategories = async (req, res) => {
  try {
    const categories = [
      { id: "overall", name: "Overall", icon: "🏆" },
      { id: "athletes", name: "Athletes", icon: "⚽" },
      { id: "esports", name: "Esports", icon: "🎮" }
    ];

    const categoriesWithStats = await Promise.all(
      categories.map(async (category) => {
        let query = { role: { $ne: "admin" } };
        if (category.id === "esports") {
          query["esportsProfile.gamerTag"] = { $exists: true, $ne: "" };
        } else if (category.id === "athletes") {
          query["athleteProfile"] = { $exists: true };
        }

        const participantCount = await User.countDocuments(query);
        return {
          ...category,
          participants: participantCount
        };
      })
    );

    res.json({
      success: true,
      data: categoriesWithStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: error.message
    });
  }
};

// getLeaderboardBySport mapped to the new API format (esports/athletes) is handled by category already
// But if they query /sport/:sport, we can just redirect to getLeaderboard
export const getLeaderboardBySport = async (req, res) => {
  req.query.category = req.params.sport;
  return getLeaderboard(req, res);
};

export const getUserRanking = async (req, res) => {
  try {
    const { userId } = req.params;

    const currUser = await User.findById(userId).populate("participatedEvents").populate("createdEvents");
    if (!currUser) return res.status(404).json({ success: false, message: "User not found" });

    const rank = await User.countDocuments({
      role: { $ne: "admin" },
      lifetimePoints: { $gt: currUser.lifetimePoints || 0 }
    }) + 1;

    const totalParticipants = await User.countDocuments({ role: { $ne: "admin" } });
    const percentile = totalParticipants > 1 ? Math.round((1 - (rank - 1) / totalParticipants) * 100) : 100;

    const nearbyCompetitorsRaw = await User.find({ role: { $ne: "admin" } })
      .select("name avatar username lifetimePoints")
      .sort({ lifetimePoints: -1 })
      .skip(Math.max(0, rank - 4))
      .limit(7)
      .lean();

    const nearbyCompetitors = nearbyCompetitorsRaw.map((u, i) => ({
      _id: u._id,
      user: { _id: u._id, name: u.name, username: u.username, avatar: u.avatar },
      points: u.lifetimePoints || 0,
    }));

    res.json({
      success: true,
      data: {
        _id: currUser._id,
        user: { _id: currUser._id, name: currUser.name, avatar: currUser.avatar, username: currUser.username },
        points: currUser.lifetimePoints || 0,
        rank,
        level: { current: Math.floor((currUser.lifetimePoints || 0) / 100) + 1 },
        totalParticipants,
        percentile,
        eventsParticipated: currUser.participatedEvents?.length || 0,
        eventsCreated: currUser.createdEvents?.length || 0,
        streak: { current: 0 },
        nearbyCompetitors
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get leaderboard stats
export const getLeaderboardStats = async (req, res) => {
  try {
    const totalParticipants = await User.countDocuments({ role: { $ne: "admin" } });

    // Monthly stats
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const activeUsers = await User.countDocuments({
      role: { $ne: "admin" },
      updatedAt: { $gte: startOfMonth }
    });

    res.json({
      success: true,
      data: {
        categoryStats: [
          { _id: "overall", totalParticipants }
        ],
        topPerformers: [],
        recentActivity: [],
        monthlyStats: {
          activeUsers,
          totalPointsEarned: 0,
          totalEventsParticipated: 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserScore = async (req, res) => {
  return res.status(400).json({ success: false, message: "Use PointService to update user score instead" });
};

// Get trophies/badges
export const getTrophies = async (req, res) => {
  try {
    const { userId } = req.query;

    // Define available trophies
    const availableTrophies = [
      {
        id: "first_event",
        name: "First Steps",
        description: "Participated in your first event",
        icon: "🏃",
        category: "participation",
        requirement: { eventsParticipated: 1 }
      },
      {
        id: "regular_participant",
        name: "Regular Participant",
        description: "Participated in 10 events",
        icon: "🎯",
        category: "participation",
        requirement: { eventsParticipated: 10 }
      },
      {
        id: "dedicated_athlete",
        name: "Dedicated Athlete",
        description: "Participated in 50 events",
        icon: "💪",
        category: "participation",
        requirement: { eventsParticipated: 50 }
      },
      {
        id: "event_organizer",
        name: "Event Organizer",
        description: "Created your first event",
        icon: "📅",
        category: "organization",
        requirement: { eventsCreated: 1 }
      },
      {
        id: "master_organizer",
        name: "Master Organizer",
        description: "Created 10 events",
        icon: "🎪",
        category: "organization",
        requirement: { eventsCreated: 10 }
      },
      {
        id: "point_collector",
        name: "Point Collector",
        description: "Earned 1000 points",
        icon: "💰",
        category: "points",
        requirement: { points: 1000 }
      },
      {
        id: "champion",
        name: "Champion",
        description: "Earned 5000 points",
        icon: "🏆",
        category: "points",
        requirement: { points: 5000 }
      },
      {
        id: "streak_master",
        name: "Streak Master",
        description: "Maintained a 7-day activity streak",
        icon: "🔥",
        category: "consistency",
        requirement: { streak: 7 }
      }
    ];

    if (userId) {
      // Get user's stats
      const userStats = await Leaderboard.find({ user: userId });

      // Check which trophies the user has earned
      const earnedTrophies = [];
      const availableToEarn = [];

      availableTrophies.forEach(trophy => {
        let hasEarned = false;

        userStats.forEach(stat => {
          const meetsRequirement = Object.entries(trophy.requirement).every(([key, value]) => {
            if (key === 'streak') {
              return stat.streak.longest >= value;
            }
            return stat[key] >= value;
          });

          if (meetsRequirement) {
            hasEarned = true;
          }
        });

        if (hasEarned) {
          earnedTrophies.push({
            ...trophy,
            earnedAt: new Date() // You might want to store actual earned dates
          });
        } else {
          availableToEarn.push(trophy);
        }
      });

      res.json({
        success: true,
        data: {
          earned: earnedTrophies,
          available: availableToEarn,
          stats: {
            totalEarned: earnedTrophies.length,
            totalAvailable: availableTrophies.length,
            completionPercentage: Math.round((earnedTrophies.length / availableTrophies.length) * 100)
          }
        }
      });
    } else {
      // Return all available trophies
      res.json({
        success: true,
        data: availableTrophies,
        categories: ["participation", "organization", "points", "consistency"]
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching trophies",
      error: error.message
    });
  }
};

// Get monthly leaderboard
export const getMonthlyLeaderboard = async (req, res) => {
  try {
    const { category = "overall", month, year } = req.query;

    // Default to current month if not specified
    const targetMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    const targetYear = year ? parseInt(year) : new Date().getFullYear();

    // Calculate date range for the month
    const startOfMonth = new Date(targetYear, targetMonth - 1, 1);
    const endOfMonth = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);

    // Get events from that month
    const monthlyEvents = await Event.find({
      date: { $gte: startOfMonth, $lte: endOfMonth },
      status: "completed"
    }).select("participants createdBy category");

    // Calculate monthly points for each user
    const userPoints = {};

    monthlyEvents.forEach(event => {
      // Points for participation
      event.participants.forEach(participant => {
        const userId = participant.user.toString();
        if (!userPoints[userId]) userPoints[userId] = 0;
        userPoints[userId] += 10; // Base participation points
      });

      // Points for organizing
      const organizerId = event.createdBy.toString();
      if (!userPoints[organizerId]) userPoints[organizerId] = 0;
      userPoints[organizerId] += 20; // Organizing points
    });

    // Convert to array and sort
    const leaderboard = await Promise.all(
      Object.entries(userPoints).map(async ([userId, points]) => {
        const user = await User.findById(userId).select("name avatar username");
        return {
          user,
          points,
          monthlyEvents: monthlyEvents.filter(e =>
            e.participants.some(p => p.user.toString() === userId) ||
            e.createdBy.toString() === userId
          ).length
        };
      })
    );

    // Sort by points and add rankings
    leaderboard.sort((a, b) => b.points - a.points);
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));

    res.json({
      success: true,
      data: rankedLeaderboard,
      period: {
        month: targetMonth,
        year: targetYear,
        monthName: new Date(targetYear, targetMonth - 1).toLocaleString('default', { month: 'long' })
      },
      stats: {
        totalParticipants: leaderboard.length,
        totalEvents: monthlyEvents.length,
        averagePoints: leaderboard.length > 0
          ? Math.round(leaderboard.reduce((sum, entry) => sum + entry.points, 0) / leaderboard.length)
          : 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching monthly leaderboard",
      error: error.message
    });
  }
};