import { Script } from "@/components/ScriptCard";

export const dataPersistenceScripts: Script[] = [
  {
    id: "data-1",
    title: "DataStore Manager",
    description: "A comprehensive DataStore system for saving and loading player data with auto-save and backup features.",
    difficulty: "Hard",
    tags: ["DataStore", "Save System", "Player Data"],
    type: "utility",
    code: `local DataStoreService = game:GetService("DataStoreService")
local Players = game:GetService("Players")

local DataManager = {}
DataManager.__index = DataManager

-- Configuration
local AUTO_SAVE_INTERVAL = 300 -- 5 minutes
local BACKUP_ENABLED = true
local MAX_RETRIES = 3

function DataManager.new(storeName)
    local self = setmetatable({}, DataManager)
    self.store = DataStoreService:GetDataStore(storeName)
    self.backupStore = BACKUP_ENABLED and DataStoreService:GetDataStore(storeName .. "_Backup")
    self.cache = {}
    self.dirty = {}
    return self
end

function DataManager:GetAsync(key, defaultData)
    -- Try to get from cache first
    if self.cache[key] then
        return self.cache[key]
    end
    
    -- Try to load from DataStore
    local success, data
    for i = 1, MAX_RETRIES do
        success, data = pcall(function()
            return self.store:GetAsync(key)
        end)
        
        if success then break end
        wait(1) -- Wait before retry
    end
    
    -- If main store fails, try backup
    if not success and self.backupStore then
        success, data = pcall(function()
            return self.backupStore:GetAsync(key)
        end)
    end
    
    -- Cache and return the data
    data = success and data or defaultData
    self.cache[key] = data
    return data
end

function DataManager:SetAsync(key, value)
    -- Update cache
    self.cache[key] = value
    self.dirty[key] = true
    
    -- Save to DataStore
    local success
    for i = 1, MAX_RETRIES do
        success = pcall(function()
            self.store:SetAsync(key, value)
            if self.backupStore then
                self.backupStore:SetAsync(key, value)
            end
        end)
        
        if success then
            self.dirty[key] = false
            break
        end
        wait(1) -- Wait before retry
    end
    
    return success
end

function DataManager:StartAutoSave()
    spawn(function()
        while wait(AUTO_SAVE_INTERVAL) do
            self:SaveDirtyData()
        end
    end)
end

function DataManager:SaveDirtyData()
    for key, _ in pairs(self.dirty) do
        if self.cache[key] then
            self:SetAsync(key, self.cache[key])
        end
    end
end

-- Example usage with player data
local PlayerData = DataManager.new("PlayerData")

Players.PlayerAdded:Connect(function(player)
    local data = PlayerData:GetAsync(player.UserId, {
        Coins = 0,
        Level = 1,
        Inventory = {},
        Settings = {
            Music = true,
            SFX = true
        }
    })
    
    -- Set up auto-save
    PlayerData:StartAutoSave()
    
    -- Create leaderstats
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    
    local coins = Instance.new("IntValue")
    coins.Name = "Coins"
    coins.Value = data.Coins
    coins.Parent = leaderstats
    
    local level = Instance.new("IntValue")
    level.Name = "Level"
    level.Value = data.Level
    level.Parent = leaderstats
    
    leaderstats.Parent = player
end)

Players.PlayerRemoving:Connect(function(player)
    -- Save player data when they leave
    if PlayerData.cache[player.UserId] then
        PlayerData:SetAsync(player.UserId, PlayerData.cache[player.UserId])
    end
end)

return PlayerData`
  },
  {
    id: "data-2",
    title: "Profile Service Setup",
    description: "Implementation of the Profile Service module for reliable player data management.",
    difficulty: "Medium",
    tags: ["DataStore", "Profile Service", "Player Data"],
    type: "utility",
    code: `local ProfileService = require(game:GetService("ServerScriptService").ProfileService)
local Players = game:GetService("Players")

-- Profile Store & Template
local ProfileTemplate = {
    Coins = 0,
    Inventory = {},
    Stats = {
        Level = 1,
        XP = 0,
        Health = 100,
        MaxHealth = 100
    },
    Achievements = {},
    Settings = {
        Music = true,
        SFX = true
    }
}

local ProfileStore = ProfileService.GetProfileStore(
    "PlayerData",
    ProfileTemplate
)

local Profiles = {}

-- Profile Management
local function PlayerAdded(player)
    local profile = ProfileStore:LoadProfileAsync(
        "Player_" .. player.UserId,
        "ForceLoad"
    )
    
    if profile ~= nil then
        profile:AddUserId(player.UserId) -- GDPR compliance
        profile:Reconcile() -- Fill in missing variables from ProfileTemplate
        
        profile:ListenToRelease(function()
            Profiles[player] = nil
            player:Kick()
        end)
        
        if player:IsDescendantOf(Players) then
            Profiles[player] = profile
            -- Set up player data here
            
            -- Create leaderstats
            local leaderstats = Instance.new("Folder")
            leaderstats.Name = "leaderstats"
            leaderstats.Parent = player
            
            local coins = Instance.new("IntValue")
            coins.Name = "Coins"
            coins.Value = profile.Data.Coins
            coins.Parent = leaderstats
            
            -- Set up data changes listener
            coins.Changed:Connect(function(newValue)
                profile.Data.Coins = newValue
            end)
            
            -- Example of updating stats
            local function updateStats()
                local stats = profile.Data.Stats
                -- Update player's character stats
                local character = player.Character
                if character then
                    local humanoid = character:FindFirstChild("Humanoid")
                    if humanoid then
                        humanoid.MaxHealth = stats.MaxHealth
                        humanoid.Health = stats.Health
                    end
                end
            end
            
            player.CharacterAdded:Connect(updateStats)
            if player.Character then
                updateStats()
            end
            
        else
            profile:Release()
        end
    else
        player:Kick("Failed to load data. Please rejoin.")
    end
end

-- Handle player joining
Players.PlayerAdded:Connect(PlayerAdded)

-- Handle player leaving
Players.PlayerRemoving:Connect(function(player)
    local profile = Profiles[player]
    if profile ~= nil then
        profile:Release()
    end
end)

-- Example function to modify player data
local function AwardCoins(player, amount)
    local profile = Profiles[player]
    if profile then
        -- Safely modify data
        profile.Data.Coins = profile.Data.Coins + amount
        -- Update leaderstats
        local leaderstats = player:FindFirstChild("leaderstats")
        if leaderstats then
            local coins = leaderstats:FindFirstChild("Coins")
            if coins then
                coins.Value = profile.Data.Coins
            end
        end
    end
end

-- Example function to save specific data
local function SavePlayerData(player)
    local profile = Profiles[player]
    if profile then
        -- Data auto-saves, but you can manually call :Save()
        -- for important data points
        profile:Save()
    end
end

return {
    AwardCoins = AwardCoins,
    SavePlayerData = SavePlayerData,
    GetProfile = function(player)
        return Profiles[player]
    end
}`
  }
];