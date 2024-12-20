import { Script } from "@/components/ScriptCard";

export const scripts: Script[] = [
  {
    id: "1",
    title: "Advanced Player Movement System",
    description: "A sophisticated movement system with double jumping, wall running, and sliding mechanics.",
    difficulty: "Hard",
    tags: ["PlayerMovement", "Physics", "Character"],
    code: `-- Services
local Players = game:GetService("Players")
local RunService = game:GetService("RunService")

-- Constants
local WALL_RUN_ANGLE = 65
local WALL_RUN_DURATION = 2
local DOUBLE_JUMP_FORCE = 50
local SLIDE_SPEED = 40
local SLIDE_DURATION = 1.2

-- Initialize
local function setupPlayerMovement(player)
    local character = player.Character or player.CharacterAdded:Wait()
    local humanoid = character:WaitForChild("Humanoid")
    local rootPart = character:WaitForChild("HumanoidRootPart")
    
    -- States
    local canDoubleJump = true
    local isWallRunning = false
    local isSliding = false
    local wallRunTimer = 0
    local slideTimer = 0
    
    -- Double Jump Logic
    humanoid.StateChanged:Connect(function(_, new)
        if new == Enum.HumanoidStateType.Landed then
            canDoubleJump = true
            isSliding = false
        end
    end)
    
    -- Wall Run Detection
    RunService.Heartbeat:Connect(function(dt)
        if isWallRunning then
            wallRunTimer = wallRunTimer + dt
            if wallRunTimer >= WALL_RUN_DURATION then
                isWallRunning = false
            end
        end
        
        -- Wall detection
        local params = RaycastParams.new()
        params.FilterType = Enum.RaycastFilterType.Blacklist
        params.FilterDescendantsInstances = {character}
        
        local result = workspace:Raycast(rootPart.Position, rootPart.CFrame.RightVector * 2.5, params)
        if result and math.abs(result.Normal.Y) < math.cos(math.rad(WALL_RUN_ANGLE)) then
            isWallRunning = true
            wallRunTimer = 0
            humanoid.WalkSpeed = 24
        end
    end)
    
    -- Sliding System
    local function startSlide()
        if not isSliding and humanoid:GetState() == Enum.HumanoidStateType.Running then
            isSliding = true
            slideTimer = 0
            humanoid.WalkSpeed = SLIDE_SPEED
            
            -- Create sliding animation
            local slideAnim = Instance.new("Animation")
            slideAnim.AnimationId = "rbxassetid://YOURSLIDINGANIMATIONID"
            local slideTrack = humanoid:LoadAnimation(slideAnim)
            slideTrack:Play()
            
            -- Slide duration
            spawn(function()
                while slideTimer < SLIDE_DURATION and isSliding do
                    slideTimer = slideTimer + wait()
                end
                if isSliding then
                    isSliding = false
                    humanoid.WalkSpeed = 16
                end
            end)
        end
    end
    
    -- Input Handler
    local UIS = game:GetService("UserInputService")
    UIS.InputBegan:Connect(function(input, gameProcessed)
        if gameProcessed then return end
        
        if input.KeyCode == Enum.KeyCode.Space then
            if not humanoid.Jump and canDoubleJump then
                canDoubleJump = false
                rootPart.Velocity = Vector3.new(
                    rootPart.Velocity.X,
                    DOUBLE_JUMP_FORCE,
                    rootPart.Velocity.Z
                )
            end
        elseif input.KeyCode == Enum.KeyCode.LeftControl then
            startSlide()
        end
    end)
end

-- Setup for each player
Players.PlayerAdded:Connect(setupPlayerMovement)
for _, player in ipairs(Players:GetPlayers()) do
    setupPlayerMovement(player)
end`,
  },
  {
    id: "2",
    title: "Dynamic Weather System",
    description: "Create realistic weather effects including rain, snow, and storms with particle effects and lighting changes.",
    difficulty: "Extreme",
    tags: ["Environment", "Particles", "Lighting"],
    code: `-- Services
local Lighting = game:GetService("Lighting")
local TweenService = game:GetService("TweenService")
local RunService = game:GetService("RunService")

-- Constants
local WEATHER_TYPES = {
    CLEAR = "Clear",
    RAIN = "Rain",
    STORM = "Storm",
    SNOW = "Snow"
}

local WEATHER_SETTINGS = {
    [WEATHER_TYPES.CLEAR] = {
        Atmosphere = { Density = 0.1, Offset = 0.25, Color = Color3.fromRGB(199, 199, 199) },
        Sky = { StarCount = 3000 },
        Lighting = { Ambient = Color3.fromRGB(150, 150, 150), Brightness = 2 }
    },
    [WEATHER_TYPES.RAIN] = {
        Atmosphere = { Density = 0.5, Offset = 0.5, Color = Color3.fromRGB(150, 150, 150) },
        Sky = { StarCount = 0 },
        Lighting = { Ambient = Color3.fromRGB(100, 100, 100), Brightness = 1 }
    },
    [WEATHER_TYPES.STORM] = {
        Atmosphere = { Density = 0.8, Offset = 0.7, Color = Color3.fromRGB(100, 100, 100) },
        Sky = { StarCount = 0 },
        Lighting = { Ambient = Color3.fromRGB(50, 50, 50), Brightness = 0.5 }
    },
    [WEATHER_TYPES.SNOW] = {
        Atmosphere = { Density = 0.3, Offset = 0.4, Color = Color3.fromRGB(200, 200, 200) },
        Sky = { StarCount = 1000 },
        Lighting = { Ambient = Color3.fromRGB(160, 160, 160), Brightness = 1.5 }
    }
}

-- Weather System Class
local WeatherSystem = {}
WeatherSystem.__index = WeatherSystem

function WeatherSystem.new()
    local self = setmetatable({}, WeatherSystem)
    
    -- Initialize components
    self.atmosphere = Instance.new("Atmosphere")
    self.atmosphere.Parent = Lighting
    
    -- Create particle emitters
    self:CreateParticleEmitters()
    
    -- Initialize weather
    self.currentWeather = WEATHER_TYPES.CLEAR
    self:SetWeather(self.currentWeather)
    
    return self
end

function WeatherSystem:CreateParticleEmitters()
    -- Rain emitter
    self.rainEmitter = Instance.new("ParticleEmitter")
    self.rainEmitter.Rate = 0
    self.rainEmitter.Speed = NumberRange.new(50, 75)
    self.rainEmitter.Lifetime = NumberRange.new(1, 2)
    self.rainEmitter.Size = NumberSequence.new(0.1)
    self.rainEmitter.Color = ColorSequence.new(Color3.fromRGB(200, 200, 200))
    
    -- Snow emitter
    self.snowEmitter = Instance.new("ParticleEmitter")
    self.snowEmitter.Rate = 0
    self.snowEmitter.Speed = NumberRange.new(10, 15)
    self.snowEmitter.Lifetime = NumberRange.new(3, 5)
    self.snowEmitter.Size = NumberSequence.new(0.15)
    self.snowEmitter.Color = ColorSequence.new(Color3.fromRGB(255, 255, 255))
    
    -- Position emitters in workspace
    local emitterPart = Instance.new("Part")
    emitterPart.Anchored = true
    emitterPart.CanCollide = false
    emitterPart.Transparency = 1
    emitterPart.Position = Vector3.new(0, 100, 0)
    emitterPart.Parent = workspace
    
    self.rainEmitter.Parent = emitterPart
    self.snowEmitter.Parent = emitterPart
end

function WeatherSystem:SetWeather(weatherType, duration)
    duration = duration or 1
    local settings = WEATHER_SETTINGS[weatherType]
    if not settings then return end
    
    -- Transition atmosphere
    local atmosphereTween = TweenService:Create(self.atmosphere, 
        TweenInfo.new(duration), 
        {
            Density = settings.Atmosphere.Density,
            Offset = settings.Atmosphere.Offset,
            Color = settings.Atmosphere.Color
        }
    )
    atmosphereTween:Play()
    
    -- Transition lighting
    local lightingTween = TweenService:Create(Lighting,
        TweenInfo.new(duration),
        {
            Ambient = settings.Lighting.Ambient,
            Brightness = settings.Lighting.Brightness
        }
    )
    lightingTween:Play()
    
    -- Update particles
    self.rainEmitter.Rate = weatherType == WEATHER_TYPES.RAIN and 500 or 
                           weatherType == WEATHER_TYPES.STORM and 1000 or 0
    
    self.snowEmitter.Rate = weatherType == WEATHER_TYPES.SNOW and 300 or 0
    
    -- Handle storm effects
    if weatherType == WEATHER_TYPES.STORM then
        self:StartLightning()
    else
        self:StopLightning()
    end
    
    self.currentWeather = weatherType
end

function WeatherSystem:StartLightning()
    if self.lightningConnection then return end
    
    self.lightningConnection = RunService.Heartbeat:Connect(function()
        if math.random() < 0.001 then -- Lightning frequency
            local flash = Instance.new("ColorCorrection")
            flash.Brightness = 0
            flash.Parent = Lighting
            
            -- Flash effect
            local flashTween = TweenService:Create(flash,
                TweenInfo.new(0.1),
                { Brightness = 0.5 }
            )
            flashTween:Play()
            
            wait(0.1)
            
            local fadeTween = TweenService:Create(flash,
                TweenInfo.new(0.2),
                { Brightness = 0 }
            )
            fadeTween:Play()
            
            game.Debris:AddItem(flash, 0.3)
        end
    end)
end

function WeatherSystem:StopLightning()
    if self.lightningConnection then
        self.lightningConnection:Disconnect()
        self.lightningConnection = nil
    end
end

-- Example usage:
local weatherSystem = WeatherSystem.new()

-- Change weather every 30 seconds
while true do
    local weatherTypes = {
        WEATHER_TYPES.CLEAR,
        WEATHER_TYPES.RAIN,
        WEATHER_TYPES.STORM,
        WEATHER_TYPES.SNOW
    }
    
    for _, weather in ipairs(weatherTypes) do
        weatherSystem:SetWeather(weather, 2)
        wait(30)
    end
end`,
  },
  {
    id: "3",
    title: "Advanced AI Combat System",
    description: "Create intelligent NPCs with combat abilities, pathfinding, and dynamic behavior patterns.",
    difficulty: "Extreme",
    tags: ["AI", "Combat", "NPCs"],
    code: `-- Services
local PathfindingService = game:GetService("PathfindingService")
local Players = game:GetService("Players")

-- Constants
local ATTACK_RANGE = 10
local CHASE_RANGE = 30
local PATROL_RADIUS = 20
local ATTACK_COOLDOWN = 2
local DAMAGE = 20

-- AI Combat System
local AICombatSystem = {}
AICombatSystem.__index = AICombatSystem

function AICombatSystem.new(npc)
    local self = setmetatable({}, AICombatSystem)
    
    self.npc = npc
    self.humanoid = npc:WaitForChild("Humanoid")
    self.rootPart = npc:WaitForChild("HumanoidRootPart")
    self.originalPosition = self.rootPart.Position
    
    -- States
    self.state = "Patrol"
    self.target = nil
    self.lastAttackTime = 0
    self.path = nil
    
    -- Initialize
    self:Setup()
    
    return self
end

function AICombatSystem:Setup()
    -- Health management
    self.humanoid.HealthChanged:Connect(function(health)
        if health <= self.humanoid.MaxHealth * 0.3 then
            self.state = "Retreat"
        end
    end)
    
    -- Main behavior loop
    spawn(function()
        while wait(0.1) do
            self:UpdateBehavior()
        end
    end)
end

function AICombatSystem:UpdateBehavior()
    -- Find nearest player
    local nearestPlayer, distance = self:FindNearestPlayer()
    
    -- Update state based on conditions
    if self.state == "Retreat" and self.humanoid.Health > self.humanoid.MaxHealth * 0.7 then
        self.state = "Patrol"
    elseif distance and distance <= ATTACK_RANGE and self.state ~= "Retreat" then
        self.state = "Attack"
        self.target = nearestPlayer
    elseif distance and distance <= CHASE_RANGE and self.state ~= "Retreat" then
        self.state = "Chase"
        self.target = nearestPlayer
    elseif self.state ~= "Retreat" then
        self.state = "Patrol"
    end
    
    -- Execute current state behavior
    if self.state == "Patrol" then
        self:Patrol()
    elseif self.state == "Chase" then
        self:Chase()
    elseif self.state == "Attack" then
        self:Attack()
    elseif self.state == "Retreat" then
        self:Retreat()
    end
end

function AICombatSystem:FindNearestPlayer()
    local nearestDistance = math.huge
    local nearestPlayer = nil
    
    for _, player in ipairs(Players:GetPlayers()) do
        local character = player.Character
        if character then
            local distance = (character.PrimaryPart.Position - self.rootPart.Position).Magnitude
            if distance < nearestDistance then
                nearestDistance = distance
                nearestPlayer = character
            end
        end
    end
    
    return nearestPlayer, nearestDistance
end

function AICombatSystem:Patrol()
    if not self.patrolTarget or (self.rootPart.Position - self.patrolTarget).Magnitude < 5 then
        -- Generate new patrol point
        local angle = math.random() * math.pi * 2
        local radius = math.random() * PATROL_RADIUS
        self.patrolTarget = self.originalPosition + Vector3.new(
            math.cos(angle) * radius,
            0,
            math.sin(angle) * radius
        )
        
        -- Create path to patrol point
        self:PathTo(self.patrolTarget)
    end
end

function AICombatSystem:Chase()
    if self.target and self.target.PrimaryPart then
        self:PathTo(self.target.PrimaryPart.Position)
    end
end

function AICombatSystem:Attack()
    if not self.target or not self.target.PrimaryPart then return end
    
    local now = tick()
    if now - self.lastAttackTime >= ATTACK_COOLDOWN then
        -- Perform attack
        local targetHumanoid = self.target:FindFirstChild("Humanoid")
        if targetHumanoid then
            targetHumanoid.Health = targetHumanoid.Health - DAMAGE
            
            -- Visual effect for attack
            local beam = Instance.new("Beam")
            beam.Width0 = 0.5
            beam.Width1 = 0.5
            beam.FaceCamera = true
            -- Add attachment points and customize beam appearance
            
            game.Debris:AddItem(beam, 0.2)
        end
        
        self.lastAttackTime = now
    end
end

function AICombatSystem:Retreat()
    -- Move away from nearest player
    local nearestPlayer = self:FindNearestPlayer()
    if nearestPlayer then
        local retreatDirection = (self.rootPart.Position - nearestPlayer.PrimaryPart.Position).Unit
        local retreatPoint = self.rootPart.Position + retreatDirection * CHASE_RANGE
        self:PathTo(retreatPoint)
    end
end

function AICombatSystem:PathTo(target)
    local path = PathfindingService:CreatePath({
        AgentRadius = 2,
        AgentHeight = 5,
        AgentCanJump = true
    })
    
    local success, errorMessage = pcall(function()
        path:ComputeAsync(self.rootPart.Position, target)
    end)
    
    if success and path.Status == Enum.PathStatus.Success then
        local waypoints = path:GetWaypoints()
        
        -- Move through waypoints
        for _, waypoint in ipairs(waypoints) do
            if self.state == "Retreat" and self.humanoid.Health > self.humanoid.MaxHealth * 0.7 then
                break
            end
            
            self.humanoid:MoveTo(waypoint.Position)
            
            -- Wait until reaching waypoint or getting close enough
            local reachedWaypoint = self.rootPart.Position:FuzzyEq(waypoint.Position, 5)
            while not reachedWaypoint do
                wait(0.1)
                reachedWaypoint = self.rootPart.Position:FuzzyEq(waypoint.Position, 5)
            end
        end
    end
end

-- Example usage:
local function createNPC()
    -- Create NPC model
    local npc = Instance.new("Model")
    -- Add necessary parts (HumanoidRootPart, etc.)
    -- Add animations and appearance
    
    local ai = AICombatSystem.new(npc)
    return npc
end

-- Spawn NPCs
for i = 1, 5 do
    local npc = createNPC()
    npc.Parent = workspace
end`,
  }
  // ... Add more scripts following the same pattern
];