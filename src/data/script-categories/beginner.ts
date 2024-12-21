import { Script } from "@/components/ScriptCard";

export const beginnerScripts: Script[] = [
  {
    id: "beginner-1",
    title: "Kill Brick",
    description: "A simple script that creates a brick that kills players on touch. Add this script to a Part in Workspace that you want to act as a kill brick.",
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
    description: "Forces players to stay in first person view. Add this script to ServerScriptService for the best results.",
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
    description: "Awards players with a badge when they meet the game owner. Add this script to ServerScriptService after creating a badge in the Creator Dashboard.",
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
    description: "Creates a simple teleporter that moves players to a designated location when touched. Add this script to the Part you want to act as the teleporter, and create another Part named 'Destination' where players will teleport to.",
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
    description: "Creates a checkpoint system that saves player's position when touched. Add this script to a Part that will act as a checkpoint.",
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
    description: "Creates a pad that temporarily increases player's speed when touched. Add this script to a Part that will act as the speed boost pad.",
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
  },
  {
    id: "beginner-7",
    title: "Name Tag",
    description: "Creates a customizable name tag that follows the player. Add this script to StarterCharacterScripts to display it for each player.",
    difficulty: "Easy",
    tags: ["Beginner", "UI", "Character"],
    type: "utility",
    code: `local Players = game:GetService("Players")
local RunService = game:GetService("RunService")

-- Configuration
local OFFSET = Vector3.new(0, 2, 0) -- Height above player
local TEXT_SIZE = 20
local BACKGROUND_COLOR = Color3.fromRGB(0, 0, 0)
local TEXT_COLOR = Color3.fromRGB(255, 255, 255)
local BACKGROUND_TRANSPARENCY = 0.5

local player = Players.LocalPlayer
local character = player.Character or player.CharacterAdded:Wait()
local humanoidRootPart = character:WaitForChild("HumanoidRootPart")

-- Create the BillboardGui
local billboardGui = Instance.new("BillboardGui")
billboardGui.Name = "NameTag"
billboardGui.Size = UDim2.new(0, 200, 0, 50)
billboardGui.StudsOffset = OFFSET
billboardGui.Adornee = humanoidRootPart
billboardGui.AlwaysOnTop = true

-- Create the background frame
local frame = Instance.new("Frame")
frame.Size = UDim2.new(1, 0, 1, 0)
frame.BackgroundColor3 = BACKGROUND_COLOR
frame.BackgroundTransparency = BACKGROUND_TRANSPARENCY
frame.BorderSizePixel = 0
frame.Parent = billboardGui

-- Create the name label
local nameLabel = Instance.new("TextLabel")
nameLabel.Size = UDim2.new(1, 0, 1, 0)
nameLabel.BackgroundTransparency = 1
nameLabel.Text = player.Name
nameLabel.TextColor3 = TEXT_COLOR
nameLabel.TextSize = TEXT_SIZE
nameLabel.Font = Enum.Font.GothamBold
nameLabel.Parent = frame

billboardGui.Parent = character

-- Update when character respawns
player.CharacterAdded:Connect(function(newCharacter)
    character = newCharacter
    humanoidRootPart = character:WaitForChild("HumanoidRootPart")
    billboardGui.Adornee = humanoidRootPart
    billboardGui.Parent = character
end)`
  },
  {
    id: "beginner-8",
    title: "Overhead Title",
    description: "Displays a customizable title above players' heads. Add this script to ServerScriptService to manage titles for all players.",
    difficulty: "Easy",
    tags: ["Beginner", "UI", "Character"],
    type: "utility",
    code: `local Players = game:GetService("Players")

-- Configuration
local TITLE_OFFSET = Vector3.new(0, 3, 0)
local TITLE_SIZE = 16
local TITLE_COLOR = Color3.fromRGB(255, 215, 0) -- Gold color
local BACKGROUND_TRANSPARENCY = 0.3

local function createTitle(player, titleText)
    local function setupTitle(character)
        local humanoidRootPart = character:WaitForChild("HumanoidRootPart")
        
        -- Create the BillboardGui
        local billboardGui = Instance.new("BillboardGui")
        billboardGui.Name = "Title"
        billboardGui.Size = UDim2.new(0, 100, 0, 30)
        billboardGui.StudsOffset = TITLE_OFFSET
        billboardGui.Adornee = humanoidRootPart
        billboardGui.AlwaysOnTop = true
        
        -- Create background
        local background = Instance.new("Frame")
        background.Size = UDim2.new(1, 0, 1, 0)
        background.BackgroundColor3 = Color3.fromRGB(0, 0, 0)
        background.BackgroundTransparency = BACKGROUND_TRANSPARENCY
        background.BorderSizePixel = 0
        background.Parent = billboardGui
        
        -- Create title text
        local titleLabel = Instance.new("TextLabel")
        titleLabel.Size = UDim2.new(1, 0, 1, 0)
        titleLabel.BackgroundTransparency = 1
        titleLabel.Text = titleText
        titleLabel.TextColor3 = TITLE_COLOR
        titleLabel.TextSize = TITLE_SIZE
        titleLabel.Font = Enum.Font.GothamBold
        titleLabel.Parent = background
        
        billboardGui.Parent = character
    end
    
    if player.Character then
        setupTitle(player.Character)
    end
    
    player.CharacterAdded:Connect(setupTitle)
end

-- Example usage: Give titles to players when they join
Players.PlayerAdded:Connect(function(player)
    -- You can customize this based on player data, rank, etc.
    createTitle(player, "VIP")
end)

-- Setup titles for existing players
for _, player in ipairs(Players:GetPlayers()) do
    createTitle(player, "VIP")
end`
  }
];