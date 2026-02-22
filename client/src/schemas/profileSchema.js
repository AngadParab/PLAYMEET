import * as z from "zod"

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name cannot exceed 50 characters"),
  username: z.string().min(3, "Username must be at least 3 characters").max(30, "Username cannot exceed 30 characters"),
  email: z.string().email("Please enter a valid email"),
  socialLinks: z.object({
    facebook: z.string().optional().or(z.literal("")),
    twitter: z.string().optional().or(z.literal("")),
    instagram: z.string().optional().or(z.literal("")),
  }).optional(),
  athleteProfile: z.object({
    bio: z.string().max(500, "Bio cannot exceed 500 characters").optional().or(z.literal("")),
    location: z.object({
      city: z.string().optional().or(z.literal("")),
      state: z.string().optional().or(z.literal("")),
      country: z.string().optional().or(z.literal("")),
    }).optional(),
    sportsPreferences: z.array(
      z.object({
        sport: z.enum([
          "Football",
          "Basketball",
          "Tennis",
          "Running",
          "Cycling",
          "Swimming",
          "Volleyball",
          "Cricket",
          "Other",
        ]),
        skillLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
      })
    ).optional(),
  }).optional(),
  esportsProfile: z.object({
    gamerTag: z.string().optional().or(z.literal("")),
    gamingBio: z.string().max(500, "Bio cannot exceed 500 characters").optional().or(z.literal("")),
    gameTitles: z.array(
      z.object({
        game: z.string(),
        skillLevel: z.enum(["Beginner", "Intermediate", "Advanced", "Pro"]),
        rank: z.string().optional(),
      })
    ).optional(),
    connectedAccounts: z.object({
      steam: z.string().optional(),
      discord: z.string().optional(),
      xbox: z.string().optional(),
      playstation: z.string().optional(),
      riot: z.string().optional(),
    }).optional(),
  }).optional(),
})

export const achievementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().or(z.literal("")),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
})