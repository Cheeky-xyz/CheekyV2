import { Script } from "@/components/ScriptCard";

export const gameMechanicsScripts: Script[] = [
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
  }
];