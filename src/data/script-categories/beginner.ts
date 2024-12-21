import { Script } from "@/components/ScriptCard";

export const beginnerScripts: Script[] = [
  {
    id: "beginner-1",
    title: "Kill Brick",
    description: "A simple script that creates a brick that kills players on touch. Perfect for obstacle courses or challenges.",
    difficulty: "Easy",
    tags: ["Beginner", "Obstacle", "Touch"],
    type: "utility",
    code: `local killBrick = script.Parent

killBrick.Touched:Connect(function(hit)
    local humanoid = hit.Parent:FindFirstChild("Humanoid")
    if humanoid then
        humanoid.Health = 0
    end
end)`
  },
  {
    id: "beginner-2",
    title: "Lock First Person",
    description: "Forces players to stay in first person view. Useful for immersive gameplay experiences.",
    difficulty: "Easy",
    tags: ["Beginner", "Camera", "View"],
    type: "utility",
    code: `local Players = game:GetService("Players")

local function lockFirstPerson(player)
    local character = player.Character or player.CharacterAdded:Wait()
    
    -- Set camera mode to first person
    player.CameraMode = Enum.CameraMode.LockFirstPerson
end

-- Lock first person for new players
Players.PlayerAdded:Connect(function(player)
    lockFirstPerson(player)
end)

-- Lock first person for existing players
for _, player in ipairs(Players:GetPlayers()) do
    lockFirstPerson(player)
end`
  },
  {
    id: "beginner-3",
    title: "Meet The Owner Badge",
    description: "Awards players with a badge when they meet the game owner. Great for community engagement.",
    difficulty: "Easy",
    tags: ["Beginner", "Badge", "Social"],
    type: "utility",
    code: `local BadgeService = game:GetService("BadgeService")
local Players = game:GetService("Players")

-- Replace with your badge ID from the Badge Creator
local BADGE_ID = 123456789
local OWNER_ID = game.CreatorId

local function awardBadge(player)
    -- Check if player already has the badge
    local success, hasBadge = pcall(function()
        return BadgeService:UserHasBadgeAsync(player.UserId, BADGE_ID)
    end)
    
    if success and not hasBadge then
        -- Award the badge
        local awarded = pcall(function()
            BadgeService:AwardBadge(player.UserId, BADGE_ID)
        end)
        
        if awarded then
            player:SetAttribute("MetOwner", true)
        end
    end
end

Players.PlayerAdded:Connect(function(player)
    if player.UserId == OWNER_ID then
        -- When owner joins, check all players
        for _, otherPlayer in ipairs(Players:GetPlayers()) do
            if otherPlayer ~= player then
                awardBadge(otherPlayer)
            end
        end
    else
        -- Check if owner is in game
        local owner = Players:GetPlayerByUserId(OWNER_ID)
        if owner then
            awardBadge(player)
        end
    end
end)`
  },
  {
    id: "beginner-4",
    title: "Basic Teleporter",
    description: "Creates a simple teleporter that moves players to a designated location when touched.",
    difficulty: "Easy",
    tags: ["Beginner", "Teleport", "Touch"],
    type: "utility",
    code: `local teleporter = script.Parent
local destination = workspace.Destination -- Replace with your destination part

teleporter.Touched:Connect(function(hit)
    local humanoid = hit.Parent:FindFirstChild("Humanoid")
    local rootPart = hit.Parent:FindFirstChild("HumanoidRootPart")
    
    if humanoid and rootPart then
        rootPart.CFrame = destination.CFrame + Vector3.new(0, 3, 0)
    end
end)`
  },
  {
    id: "beginner-5",
    title: "Simple Checkpoint",
    description: "Creates a checkpoint system that saves player's position when touched.",
    difficulty: "Easy",
    tags: ["Beginner", "Checkpoint", "Touch"],
    type: "utility",
    code: `local checkpoint = script.Parent

local function setSpawnPoint(player, position)
    local leaderstats = player:FindFirstChild("leaderstats")
    if leaderstats then
        local spawnPoint = leaderstats:FindFirstChild("SpawnPoint")
        if spawnPoint then
            spawnPoint.Value = position
        end
    end
end

checkpoint.Touched:Connect(function(hit)
    local player = game.Players:GetPlayerFromCharacter(hit.Parent)
    if player then
        setSpawnPoint(player, checkpoint.Position)
        game.StarterGui:SetCore("SendNotification", {
            Title = "Checkpoint",
            Text = "Checkpoint saved!",
            Duration = 2
        })
    end
end)`
  },
  {
    id: "beginner-6",
    title: "Speed Boost Pad",
    description: "Creates a pad that temporarily increases player's speed when touched.",
    difficulty: "Easy",
    tags: ["Beginner", "Speed", "Touch"],
    type: "utility",
    code: `local speedPad = script.Parent
local SPEED_MULTIPLIER = 2
local DURATION = 3

speedPad.Touched:Connect(function(hit)
    local humanoid = hit.Parent:FindFirstChild("Humanoid")
    if humanoid then
        local originalSpeed = humanoid.WalkSpeed
        humanoid.WalkSpeed = originalSpeed * SPEED_MULTIPLIER
        
        wait(DURATION)
        
        if humanoid then
            humanoid.WalkSpeed = originalSpeed
        end
    end
end)`
  }
];