import { Script } from "@/components/ScriptCard";

export const uiElementsScripts: Script[] = [
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