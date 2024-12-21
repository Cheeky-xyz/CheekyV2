import { Script } from "@/components/ScriptCard";

export const basicInteractionScripts: Script[] = [
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
  }
];