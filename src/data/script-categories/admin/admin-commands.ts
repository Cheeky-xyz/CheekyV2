import { Script } from "@/components/ScriptCard";

export const adminCommandsScripts: Script[] = [
  {
    id: "admin-1",
    title: "Admin Commands System",
    description: "Creates a comprehensive admin commands system based on UserIDs. Add this script to ServerScriptService to enable admin commands for specific users.",
    difficulty: "Medium",
    tags: ["Admin", "Commands", "Moderation"],
    type: "utility",
    code: `local Players = game:GetService("Players")

-- Configuration: Add UserIDs for different admin levels
local ADMINS = {
    SuperAdmin = {
        [123456789] = true,  -- Replace with actual Super Admin UserIDs
        [987654321] = true
    },
    Admin = {
        [111222333] = true,  -- Replace with actual Admin UserIDs
        [444555666] = true
    },
    Moderator = {
        [777888999] = true  -- Replace with actual Moderator UserIDs
    }
}

-- Command permissions
local COMMANDS = {
    ["kick"] = {"SuperAdmin", "Admin"},
    ["ban"] = {"SuperAdmin"},
    ["mute"] = {"SuperAdmin", "Admin", "Moderator"},
    ["tp"] = {"SuperAdmin", "Admin", "Moderator"},
    ["give"] = {"SuperAdmin"}
}

local function hasPermission(player, command)
    local userId = player.UserId
    local allowedRanks = COMMANDS[command]
    
    if not allowedRanks then return false end
    
    for _, rank in ipairs(allowedRanks) do
        if ADMINS[rank] and ADMINS[rank][userId] then
            return true
        end
    end
    
    return false
end

local function executeCommand(player, command, ...)
    if not hasPermission(player, command) then
        player:SendMessage("You don't have permission to use this command!")
        return
    end
    
    local args = {...}
    
    if command == "kick" then
        local targetPlayer = Players:FindFirstChild(args[1])
        if targetPlayer then
            targetPlayer:Kick("Kicked by admin")
        end
    elseif command == "ban" then
        -- Implement ban logic
    elseif command == "mute" then
        local targetPlayer = Players:FindFirstChild(args[1])
        if targetPlayer then
            targetPlayer:SetAttribute("Muted", true)
        end
    elseif command == "tp" then
        local targetPlayer = Players:FindFirstChild(args[1])
        if targetPlayer and player.Character and targetPlayer.Character then
            player.Character:MoveTo(targetPlayer.Character.PrimaryPart.Position)
        end
    elseif command == "give" then
        -- Implement give item logic
    end
end

-- Listen for chat commands
Players.PlayerAdded:Connect(function(player)
    player.Chatted:Connect(function(message)
        if message:sub(1,1) == "/" then
            local args = message:split(" ")
            local command = args[1]:sub(2)
            table.remove(args, 1)
            executeCommand(player, command, unpack(args))
        end
    end)
end)`
  }
];