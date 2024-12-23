import { Script } from "@/components/ScriptCard";

export const socialFeaturesScripts: Script[] = [
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
    id: "beginner-8",
    title: "Chat Tag System",
    description: "Displays customizable tags above players' chat messages based on their UserID. Add this script to ServerScriptService to manage chat tags for specific players.",
    difficulty: "Easy",
    tags: ["Beginner", "UI", "Chat"],
    type: "utility",
    code: `local Players = game:GetService("Players")
local ChatService = game:GetService("Chat")

-- Configuration: Add UserIDs for players who should have specific tags
local SPECIAL_USERS = {
    VIP = {
        [123456789] = true,  -- Replace with actual VIP UserIDs
        [987654321] = true
    },
    Admin = {
        [111222333] = true,  -- Replace with actual Admin UserIDs
        [444555666] = true
    },
    Developer = {
        [777888999] = true  -- Replace with actual Developer UserIDs
    }
}

-- Tag configurations
local TAGS = {
    ["VIP"] = {
        Text = "[VIP]",
        Color = Color3.fromRGB(255, 215, 0) -- Gold color
    },
    ["Admin"] = {
        Text = "[Admin]",
        Color = Color3.fromRGB(255, 0, 0) -- Red color
    },
    ["Developer"] = {
        Text = "[Dev]",
        Color = Color3.fromRGB(0, 255, 255) -- Cyan color
    }
}

local function getPlayerTag(player)
    local userId = player.UserId
    
    -- Check each tag type
    for tagType, users in pairs(SPECIAL_USERS) do
        if users[userId] then
            return TAGS[tagType]
        end
    end
    
    return nil
end

local function formatMessage(speaker, message, channelName)
    local player = Players:GetPlayerByUserId(speaker.UserId)
    if not player then return message end
    
    local tag = getPlayerTag(player)
    if tag then
        -- Format the message with the tag
        local tagText = string.format(
            '<font color="rgb(%d,%d,%d)">%s</font>',
            tag.Color.R * 255,
            tag.Color.G * 255,
            tag.Color.B * 255,
            tag.Text
        )
        return tagText .. " " .. message
    end
    
    return message
end

-- Set up chat tags
ChatService.Chatted:Connect(function(channel, speaker, message, channelName)
    local formattedMessage = formatMessage(speaker, message, channelName)
    if formattedMessage ~= message then
        -- Update the message with the tag
        channel:SendSystemMessage(formattedMessage)
    end
end)`
  },
  {
    id: "beginner-9",
    title: "Custom Name Color",
    description: "Changes player name colors based on their UserID. Add this script to ServerScriptService to manage name colors for specific players.",
    difficulty: "Easy",
    tags: ["Beginner", "UI", "Customization"],
    type: "utility",
    code: `local Players = game:GetService("Players")

-- Configuration: Add UserIDs and their corresponding colors
local SPECIAL_COLORS = {
    [123456789] = Color3.fromRGB(255, 215, 0),  -- Gold for specific user
    [987654321] = Color3.fromRGB(255, 0, 255),  -- Purple for specific user
    [111222333] = Color3.fromRGB(0, 255, 255)   -- Cyan for specific user
}

local function setNameColor(player)
    local userId = player.UserId
    
    -- Check if player should have a special color
    if SPECIAL_COLORS[userId] then
        -- Set the custom name color
        local color = SPECIAL_COLORS[userId]
        player.Team = nil  -- Remove team color if any
        player.TeamColor = BrickColor.new(color)
        player.Neutral = false
        
        -- Update chat name color
        local function updateChatName()
            local chatTag = player:FindFirstChild("ChatTag")
            if chatTag then
                chatTag.TagColor = color
            end
        end
        
        updateChatName()
        player.CharacterAdded:Connect(updateChatName)
    end
end

-- Apply colors to new players
Players.PlayerAdded:Connect(setNameColor)

-- Apply colors to existing players
for _, player in ipairs(Players:GetPlayers()) do
    setNameColor(player)
end`
  },
  {
    id: "beginner-10",
    title: "Custom Join Messages",
    description: "Displays custom join messages for specific UserIDs. Add this script to ServerScriptService to show special messages when specific players join.",
    difficulty: "Easy",
    tags: ["Beginner", "UI", "Social"],
    type: "utility",
    code: `local Players = game:GetService("Players")

-- Configuration: Add UserIDs and their custom join messages
local SPECIAL_MESSAGES = {
    [123456789] = {
        Message = "⭐ The Amazing %s has joined! ⭐",
        Color = Color3.fromRGB(255, 215, 0)
    },
    [987654321] = {
        Message = "👑 Welcome the Legendary %s! 👑",
        Color = Color3.fromRGB(255, 0, 255)
    },
    [111222333] = {
        Message = "🛠️ Developer %s has entered the game! 🛠️",
        Color = Color3.fromRGB(0, 255, 255)
    }
}

local function announceJoin(player)
    local userId = player.UserId
    
    -- Check if player should have a special message
    if SPECIAL_MESSAGES[userId] then
        local config = SPECIAL_MESSAGES[userId]
        local message = string.format(config.Message, player.Name)
        
        -- Announce to all players
        for _, otherPlayer in ipairs(Players:GetPlayers()) do
            game.StarterGui:SetCore("ChatMakeSystemMessage", {
                Text = message,
                Color = config.Color,
                Font = Enum.Font.GothamBold,
                TextSize = 18
            })
        end
    end
end

-- Show special messages for new players
Players.PlayerAdded:Connect(announceJoin)`
  }
];