import { Script } from "@/components/ScriptCard";

export const combatScripts: Script[] = [
  {
    id: "combat-1",
    title: "Advanced AI Combat System",
    description: "Create intelligent NPCs with combat abilities, pathfinding, and dynamic behavior patterns.",
    difficulty: "Extreme",
    tags: ["AI", "Combat", "NPCs"],
    code: `// ... keep existing code (Advanced AI Combat System script)`
  },
  {
    id: "combat-2",
    title: "Weapon System",
    description: "Complete weapon system with recoil, bullet spread, and damage falloff.",
    difficulty: "Hard",
    tags: ["Combat", "Weapons", "FPS"],
    code: `local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Players = game:GetService("Players")
local RunService = game:GetService("RunService")

-- Weapon Configuration
local WeaponStats = {
    Damage = 20,
    FireRate = 600, -- RPM
    Range = 1000,
    Spread = 2,
    RecoilPattern = {
        Vector3.new(0.5, 1, 0),
        Vector3.new(-0.3, 1.2, 0),
        Vector3.new(0.4, 1.4, 0),
        Vector3.new(-0.6, 1.1, 0),
    },
    RecoilRecovery = 0.95,
    AimSpreadMultiplier = 0.5,
    MovementSpreadMultiplier = 1.5,
    DamageFalloff = {
        Start = 20, -- Units
        End = 100, -- Units
        Multiplier = 0.5 -- Minimum damage multiplier at max range
    }
}

-- Remote Events
local WeaponEvents = {
    Fire = Instance.new("RemoteEvent"),
    Hit = Instance.new("RemoteEvent")
}

for name, event in pairs(WeaponEvents) do
    event.Name = "Weapon" .. name
    event.Parent = ReplicatedStorage
end

-- Weapon Class
local Weapon = {}
Weapon.__index = Weapon

function Weapon.new(model)
    local self = setmetatable({}, Weapon)
    
    self.Model = model
    self.Equipped = false
    self.Reloading = false
    self.CurrentSpread = WeaponStats.Spread
    self.CurrentRecoil = Vector3.new(0, 0, 0)
    self.ShotsInBurst = 0
    self.LastShotTime = 0
    
    return self
end

function Weapon:CalculateSpread()
    local spread = self.CurrentSpread
    
    -- Apply modifiers
    if self.Aiming then
        spread = spread * WeaponStats.AimSpreadMultiplier
    end
    
    if self.Moving then
        spread = spread * WeaponStats.MovementSpreadMultiplier
    end
    
    return spread
end

function Weapon:CalculateDamage(distance)
    local damage = WeaponStats.Damage
    
    -- Apply damage falloff
    if distance > WeaponStats.DamageFalloff.Start then
        local falloffRange = WeaponStats.DamageFalloff.End - WeaponStats.DamageFalloff.Start
        local currentRange = distance - WeaponStats.DamageFalloff.Start
        local falloffMultiplier = 1 - math.min(currentRange / falloffRange, 1) * 
            (1 - WeaponStats.DamageFalloff.Multiplier)
            
        damage = damage * falloffMultiplier
    end
    
    return damage
end

function Weapon:Fire(origin, direction)
    local now = tick()
    local timeSinceLastShot = now - self.LastShotTime
    
    -- Check fire rate
    if timeSinceLastShot < (60 / WeaponStats.FireRate) then
        return
    end
    
    -- Apply spread
    local spread = self:CalculateSpread()
    local spreadX = (math.random() - 0.5) * spread
    local spreadY = (math.random() - 0.5) * spread
    
    local spreadDirection = direction + Vector3.new(spreadX, spreadY, 0)
    
    -- Apply recoil
    local recoilIndex = (self.ShotsInBurst % #WeaponStats.RecoilPattern) + 1
    local recoilForce = WeaponStats.RecoilPattern[recoilIndex]
    self.CurrentRecoil = self.CurrentRecoil + recoilForce
    
    -- Perform raycast
    local raycastResult = workspace:Raycast(origin, spreadDirection * WeaponStats.Range)
    
    if raycastResult then
        local hitPart = raycastResult.Instance
        local hitPosition = raycastResult.Position
        local hitDistance = (hitPosition - origin).Magnitude
        
        -- Calculate damage
        local damage = self:CalculateDamage(hitDistance)
        
        -- Handle hit
        if hitPart.Parent:FindFirstChild("Humanoid") then
            WeaponEvents.Hit:FireServer(hitPart, hitPosition, damage)
        end
    end
    
    -- Update weapon state
    self.LastShotTime = now
    self.ShotsInBurst = self.ShotsInBurst + 1
    
    -- Recovery
    spawn(function()
        while self.CurrentRecoil.Magnitude > 0.01 do
            self.CurrentRecoil = self.CurrentRecoil * WeaponStats.RecoilRecovery
            wait(0.016)
        end
    end)
end

-- Server-side hit registration
if game:GetService("RunService"):IsServer() then
    WeaponEvents.Hit.OnServerEvent:Connect(function(player, hitPart, hitPosition, damage)
        local humanoid = hitPart.Parent:FindFirstChild("Humanoid")
        if humanoid then
            humanoid.Health = humanoid.Health - damage
        end
    end)
end

return Weapon`
  }
];