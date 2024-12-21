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
    title: "Chat Tag",
    description: "Displays a customizable tag above players' chat messages. Add this script to ServerScriptService to manage chat tags for all players.",
    difficulty: "Easy",
    tags: ["Beginner", "UI", "Chat"],
    type: "utility",
    code: `local Players = game:GetService("Players")
local ChatService = game:GetService("Chat")

-- Configuration
local TAGS = {
    ["VIP"] = {
        Text = "[VIP]",
        Color = Color3.fromRGB(255, 215, 0) -- Gold color
    },
    ["Admin"] = {
        Text = "[Admin]",
        Color = Color3.fromRGB(255, 0, 0) -- Red color
    }
}

local function getPlayerTag(player)
    -- You can customize this logic based on your game's needs
    if player:GetAttribute("VIP") then
        return TAGS["VIP"]
    elseif player:GetAttribute("Admin") then
        return TAGS["Admin"]
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
end)

-- Example of how to give a player a tag
local function givePlayerTag(player, tagType)
    player:SetAttribute(tagType, true)
end

-- Usage example:
-- givePlayerTag(somePlayer, "VIP")`
  }
];