import { Script } from "@/components/ScriptCard";

export const movementScripts: Script[] = [
  {
    id: "movement-1",
    title: "Advanced Player Movement System",
    description: "A sophisticated movement system with double jumping, wall running, and sliding mechanics.",
    difficulty: "Hard",
    tags: ["PlayerMovement", "Physics", "Character"],
    type: "movement",
    code: `// ... keep existing code (Advanced Player Movement System script)`
  },
  {
    id: "movement-2",
    title: "Parkour System",
    description: "Complete parkour system with wall climbing, ledge grabbing, and vaulting mechanics.",
    difficulty: "Extreme",
    tags: ["Parkour", "Physics", "Character"],
    type: "movement",
    code: `local Players = game:GetService("Players")
local RunService = game:GetService("RunService")

-- Constants
local CLIMB_SPEED = 16
local VAULT_FORCE = 50
local LEDGE_GRAB_RANGE = 2.5
local WALL_CHECK_DISTANCE = 3

local function setupParkourSystem(player)
    local character = player.Character or player.CharacterAdded:Wait()
    local humanoid = character:WaitForChild("Humanoid")
    local rootPart = character:WaitForChild("HumanoidRootPart")
    
    -- States
    local isWallClimbing = false
    local isLedgeGrabbing = false
    local isVaulting = false
    
    -- Wall Climb Detection
    local function checkWall()
        local params = RaycastParams.new()
        params.FilterType = Enum.RaycastFilterType.Blacklist
        params.FilterDescendantsInstances = {character}
        
        local result = workspace:Raycast(rootPart.Position, rootPart.CFrame.LookVector * WALL_CHECK_DISTANCE, params)
        return result and result.Normal.Y > -0.5
    end
    
    -- Ledge Detection
    local function checkLedge()
        local params = RaycastParams.new()
        params.FilterType = Enum.RaycastFilterType.Blacklist
        params.FilterDescendantsInstances = {character}
        
        local upResult = workspace:Raycast(rootPart.Position + Vector3.new(0, 3, 0), 
            rootPart.CFrame.LookVector * LEDGE_GRAB_RANGE, params)
            
        local downResult = workspace:Raycast(rootPart.Position + Vector3.new(0, 2, 0), 
            Vector3.new(0, -1, 0) * 2, params)
            
        return not upResult and downResult
    end
    
    -- Vault Detection
    local function checkVault()
        local params = RaycastParams.new()
        params.FilterType = Enum.RaycastFilterType.Blacklist
        params.FilterDescendantsInstances = {character}
        
        local result = workspace:Raycast(rootPart.Position, 
            rootPart.CFrame.LookVector * 2.5, params)
            
        return result and result.Instance.Size.Y < 4
    end
    
    -- Movement Handler
    RunService.Heartbeat:Connect(function(dt)
        if isWallClimbing then
            if checkWall() then
                rootPart.Velocity = Vector3.new(
                    rootPart.Velocity.X,
                    CLIMB_SPEED,
                    rootPart.Velocity.Z
                )
            else
                isWallClimbing = false
            end
        end
        
        if isLedgeGrabbing then
            if checkLedge() then
                rootPart.Velocity = Vector3.new(0, 0, 0)
                -- Animation could be played here
            else
                isLedgeGrabbing = false
            end
        end
    end)
    
    -- Input Handler
    local UIS = game:GetService("UserInputService")
    UIS.InputBegan:Connect(function(input, gameProcessed)
        if gameProcessed then return end
        
        if input.KeyCode == Enum.KeyCode.F then
            if checkWall() then
                isWallClimbing = true
            elseif checkLedge() then
                isLedgeGrabbing = true
            elseif checkVault() and not isVaulting then
                isVaulting = true
                
                -- Perform vault
                rootPart.Velocity = rootPart.CFrame.LookVector * VAULT_FORCE +
                    Vector3.new(0, VAULT_FORCE * 0.5, 0)
                    
                wait(0.5)
                isVaulting = false
            end
        end
    end)
end

-- Setup for each player
Players.PlayerAdded:Connect(setupParkourSystem)
for _, player in ipairs(Players:GetPlayers()) do
    setupParkourSystem(player)
end`
  },
  {
    id: "movement-3",
    title: "Vehicle Physics System",
    description: "Realistic vehicle physics with suspension, engine forces, and drift mechanics.",
    difficulty: "Extreme",
    tags: ["Vehicles", "Physics", "Racing"],
    type: "movement",
    code: `local RunService = game:GetService("RunService")
local UserInputService = game:GetService("UserInputService")

-- Vehicle Configuration
local VehicleConfig = {
    MaxSpeed = 100,
    Acceleration = 10,
    BrakeForce = 15,
    TurnSpeed = 3,
    DriftFactor = 0.8,
    SuspensionHeight = 2,
    SuspensionDamping = 0.5,
    SuspensionStiffness = 1000,
    GripFactor = 0.9,
    Mass = 1800
}

local function createVehicle(model)
    local vehicle = {}
    vehicle.Model = model
    vehicle.Velocity = Vector3.new(0, 0, 0)
    vehicle.AngularVelocity = 0
    vehicle.Speed = 0
    vehicle.IsDrifting = false
    
    -- Setup suspension raycasts
    vehicle.SuspensionPoints = {
        FrontLeft = model.FrontLeft.Position,
        FrontRight = model.FrontRight.Position,
        RearLeft = model.RearLeft.Position,
        RearRight = model.RearRight.Position
    }
    
    -- Physics update
    function vehicle:Update(dt)
        local throttle = 0
        local steering = 0
        local brake = 0
        
        -- Input handling
        if UserInputService:IsKeyDown(Enum.KeyCode.W) then
            throttle = 1
        elseif UserInputService:IsKeyDown(Enum.KeyCode.S) then
            brake = 1
        end
        
        if UserInputService:IsKeyDown(Enum.KeyCode.A) then
            steering = -1
        elseif UserInputService:IsKeyDown(Enum.KeyCode.D) then
            steering = 1
        end
        
        -- Apply forces
        local forwardForce = self.Model.CFrame.LookVector * 
            throttle * VehicleConfig.Acceleration * dt
            
        local brakeForce = -self.Velocity.Unit * 
            brake * VehicleConfig.BrakeForce * dt
            
        -- Update velocity
        self.Velocity = self.Velocity + forwardForce + brakeForce
        
        -- Apply turning
        self.AngularVelocity = self.AngularVelocity + 
            steering * VehicleConfig.TurnSpeed * dt
            
        -- Apply drift mechanics
        if UserInputService:IsKeyDown(Enum.KeyCode.Space) and self.Speed > 10 then
            self.IsDrifting = true
            self.GripFactor = VehicleConfig.GripFactor * VehicleConfig.DriftFactor
        else
            self.IsDrifting = false
            self.GripFactor = VehicleConfig.GripFactor
        end
        
        -- Update suspension
        for point, position in pairs(self.SuspensionPoints) do
            local rayOrigin = position + Vector3.new(0, VehicleConfig.SuspensionHeight, 0)
            local rayDirection = Vector3.new(0, -VehicleConfig.SuspensionHeight * 2, 0)
            
            local raycastResult = workspace:Raycast(rayOrigin, rayDirection)
            if raycastResult then
                local suspensionForce = (VehicleConfig.SuspensionHeight - raycastResult.Distance) *
                    VehicleConfig.SuspensionStiffness
                    
                local dampingForce = -self.Velocity.Y * VehicleConfig.SuspensionDamping
                
                local totalForce = Vector3.new(0, suspensionForce + dampingForce, 0)
                self.Velocity = self.Velocity + totalForce * dt / VehicleConfig.Mass
            end
        end
        
        -- Update position and orientation
        self.Model:SetPrimaryPartCFrame(
            self.Model.PrimaryPart.CFrame *
            CFrame.new(self.Velocity * dt) *
            CFrame.Angles(0, self.AngularVelocity * dt, 0)
        )
        
        -- Update speed
        self.Speed = self.Velocity.Magnitude
        if self.Speed > VehicleConfig.MaxSpeed then
            self.Velocity = self.Velocity.Unit * VehicleConfig.MaxSpeed
        end
    end
    
    return vehicle
end

-- Example usage:
local function setupVehicle(vehicleModel)
    local vehicle = createVehicle(vehicleModel)
    
    RunService.Heartbeat:Connect(function(dt)
        vehicle:Update(dt)
    end)
end

return setupVehicle`
  }
];
