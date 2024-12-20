import { Script } from "@/components/ScriptCard";

export const scripts: Script[] = [
  {
    id: "1",
    title: "Advanced Player Movement System",
    description: "A sophisticated movement system with double jumping, wall running, and sliding mechanics.",
    difficulty: "Hard",
    tags: ["PlayerMovement", "Physics", "Character"],
    code: `local Players = game:GetService("Players")
local RunService = game:GetService("RunService")

local WALL_RUN_ANGLE = 65
local WALL_RUN_DURATION = 2
local DOUBLE_JUMP_FORCE = 50

local function setupPlayerMovement(player)
    local character = player.Character or player.CharacterAdded:Wait()
    local humanoid = character:WaitForChild("Humanoid")
    local rootPart = character:WaitForChild("HumanoidRootPart")
    
    local canDoubleJump = true
    local isWallRunning = false
    local wallRunTimer = 0
    
    -- Double Jump Logic
    humanoid.StateChanged:Connect(function(_, new)
        if new == Enum.HumanoidStateType.Landed then
            canDoubleJump = true
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
    code: `local Lighting = game:GetService("Lighting")
local TweenService = game:GetService("TweenService")

local WeatherSystem = {}
WeatherSystem.__index = WeatherSystem

-- Weather presets
local WEATHER_PRESETS = {
    Clear = {
        Atmosphere = { Density = 0.1, Offset = 0.25, Color = Color3.fromRGB(199, 199, 199) },
        Sky = { StarCount = 3000 },
        Lighting = { Ambient = Color3.fromRGB(150, 150, 150), Brightness = 2 }
    },
    Rain = {
        Atmosphere = { Density = 0.5, Offset = 0.5, Color = Color3.fromRGB(150, 150, 150) },
        Sky = { StarCount = 0 },
        Lighting = { Ambient = Color3.fromRGB(100, 100, 100), Brightness = 1 }
    },
    Storm = {
        Atmosphere = { Density = 0.8, Offset = 0.7, Color = Color3.fromRGB(100, 100, 100) },
        Sky = { StarCount = 0 },
        Lighting = { Ambient = Color3.fromRGB(50, 50, 50), Brightness = 0.5 }
    }
}

function WeatherSystem.new()
    local self = setmetatable({}, WeatherSystem)
    
    -- Initialize weather components
    self.atmosphere = Instance.new("Atmosphere")
    self.atmosphere.Parent = Lighting
    
    self.rainEmitter = Instance.new("ParticleEmitter")
    self.rainEmitter.Rate = 0
    self.rainEmitter.Speed = NumberRange.new(50, 75)
    self.rainEmitter.Lifetime = NumberRange.new(1, 2)
    self.rainEmitter.Size = NumberSequence.new(0.1)
    self.rainEmitter.Color = ColorSequence.new(Color3.fromRGB(200, 200, 200))
    
    -- Create lightning system
    self.lightningDebounce = false
    
    return self
end

function WeatherSystem:TransitionTo(weatherType, duration)
    duration = duration or 1
    local preset = WEATHER_PRESETS[weatherType]
    if not preset then return end
    
    -- Transition atmosphere
    local atmosphereTween = TweenService:Create(self.atmosphere, TweenInfo.new(duration), {
        Density = preset.Atmosphere.Density,
        Offset = preset.Atmosphere.Offset,
        Color = preset.Atmosphere.Color
    })
    atmosphereTween:Play()
    
    -- Transition lighting
    local lightingTween = TweenService:Create(Lighting, TweenInfo.new(duration), {
        Ambient = preset.Lighting.Ambient,
        Brightness = preset.Lighting.Brightness
    })
    lightingTween:Play()
    
    -- Handle rain particles
    if weatherType == "Rain" or weatherType == "Storm" then
        self.rainEmitter.Rate = weatherType == "Storm" and 1000 or 500
    else
        self.rainEmitter.Rate = 0
    end
    
    -- Handle lightning for storms
    if weatherType == "Storm" and not self.lightningDebounce then
        self:StartLightning()
    elseif weatherType ~= "Storm" then
        self.lightningDebounce = false
    end
end

function WeatherSystem:StartLightning()
    self.lightningDebounce = true
    
    spawn(function()
        while self.lightningDebounce do
            wait(math.random(5, 15))
            
            -- Create lightning flash
            local flash = Instance.new("ColorCorrection")
            flash.Brightness = 0
            flash.Parent = Lighting
            
            -- Flash effect
            local flashTween = TweenService:Create(flash, TweenInfo.new(0.1), {
                Brightness = 0.5
            })
            flashTween:Play()
            
            wait(0.1)
            
            local fadeTween = TweenService:Create(flash, TweenInfo.new(0.2), {
                Brightness = 0
            })
            fadeTween:Play()
            
            wait(0.2)
            flash:Destroy()
        end
    end)
end

return WeatherSystem`,
  },
  // ... Add more scripts here following the same pattern
];