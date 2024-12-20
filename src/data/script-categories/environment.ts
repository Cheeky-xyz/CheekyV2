import { Script } from "@/components/ScriptCard";

export const environmentScripts: Script[] = [
  {
    id: "env-1",
    title: "Dynamic Weather System",
    description: "Create realistic weather effects including rain, snow, and storms with particle effects and lighting changes.",
    difficulty: "Extreme",
    tags: ["Environment", "Particles", "Lighting"],
    type: "utility",
    code: `local Lighting = game:GetService("Lighting")
local TweenService = game:GetService("TweenService")
local RunService = game:GetService("RunService")

-- Configuration
local CYCLE_DURATION = 600 -- 10 minutes per full day
local DAWN_TIME = 0.25 -- 6:00 AM
local NOON_TIME = 0.5 -- 12:00 PM
local DUSK_TIME = 0.75 -- 6:00 PM
local NIGHT_TIME = 1.0 -- 12:00 AM

-- Time settings for different periods
local TimeSettings = {
    Dawn = {
        ClockTime = 6,
        Ambient = Color3.fromRGB(150, 150, 170),
        Brightness = 1,
        ColorShift_Bottom = Color3.fromRGB(205, 167, 132),
        ColorShift_Top = Color3.fromRGB(245, 184, 146),
        OutdoorAmbient = Color3.fromRGB(185, 178, 167),
        ShadowSoftness = 0.2,
        ExposureCompensation = 0.2
    },
    Noon = {
        ClockTime = 12,
        Ambient = Color3.fromRGB(200, 200, 200),
        Brightness = 2,
        ColorShift_Bottom = Color3.fromRGB(255, 255, 255),
        ColorShift_Top = Color3.fromRGB(255, 255, 255),
        OutdoorAmbient = Color3.fromRGB(150, 150, 150),
        ShadowSoftness = 0.1,
        ExposureCompensation = 0
    },
    Dusk = {
        ClockTime = 18,
        Ambient = Color3.fromRGB(150, 130, 170),
        Brightness = 1,
        ColorShift_Bottom = Color3.fromRGB(145, 112, 147),
        ColorShift_Top = Color3.fromRGB(180, 128, 164),
        OutdoorAmbient = Color3.fromRGB(163, 145, 167),
        ShadowSoftness = 0.3,
        ExposureCompensation = 0.1
    },
    Night = {
        ClockTime = 0,
        Ambient = Color3.fromRGB(70, 70, 100),
        Brightness = 0.5,
        ColorShift_Bottom = Color3.fromRGB(50, 50, 80),
        ColorShift_Top = Color3.fromRGB(80, 80, 120),
        OutdoorAmbient = Color3.fromRGB(60, 60, 90),
        ShadowSoftness = 0.4,
        ExposureCompensation = 0.4
    }
}

-- Atmosphere settings
local AtmosphereSettings = {
    Dawn = {
        Density = 0.3,
        Offset = 0.25,
        Color = Color3.fromRGB(199, 175, 166),
        Decay = Color3.fromRGB(92, 60, 14),
        Glare = 0.3,
        Haze = 2
    },
    Noon = {
        Density = 0.2,
        Offset = 0,
        Color = Color3.fromRGB(199, 199, 199),
        Decay = Color3.fromRGB(92, 92, 92),
        Glare = 0.4,
        Haze = 1
    },
    Dusk = {
        Density = 0.3,
        Offset = 0.25,
        Color = Color3.fromRGB(199, 166, 175),
        Decay = Color3.fromRGB(92, 14, 60),
        Glare = 0.3,
        Haze = 2
    },
    Night = {
        Density = 0.4,
        Offset = 0.5,
        Color = Color3.fromRGB(166, 166, 199),
        Decay = Color3.fromRGB(14, 14, 92),
        Glare = 0.1,
        Haze = 3
    }
}

-- Create atmosphere if it doesn't exist
local atmosphere = Instance.new("Atmosphere")
atmosphere.Parent = Lighting

-- Lerp function for Color3 values
local function lerpColor3(a, b, t)
    return Color3.new(
        a.R + (b.R - a.R) * t,
        a.G + (b.G - a.G) * t,
        a.B + (b.B - a.B) * t
    )
end

-- Get settings based on current time
local function getSettings(currentTime)
    local settings = {}
    local atmSettings = {}
    
    if currentTime < DAWN_TIME then
        local t = currentTime / DAWN_TIME
        settings = TimeSettings.Night
        atmSettings = AtmosphereSettings.Night
    elseif currentTime < NOON_TIME then
        local t = (currentTime - DAWN_TIME) / (NOON_TIME - DAWN_TIME)
        settings = TimeSettings.Dawn
        atmSettings = AtmosphereSettings.Dawn
    elseif currentTime < DUSK_TIME then
        local t = (currentTime - NOON_TIME) / (DUSK_TIME - NOON_TIME)
        settings = TimeSettings.Noon
        atmSettings = AtmosphereSettings.Noon
    else
        local t = (currentTime - DUSK_TIME) / (NIGHT_TIME - DUSK_TIME)
        settings = TimeSettings.Dusk
        atmSettings = AtmosphereSettings.Dusk
    end
    
    return settings, atmSettings
end

-- Update lighting
local function updateLighting(currentTime)
    local settings, atmSettings = getSettings(currentTime)
    
    -- Update lighting properties
    for property, value in pairs(settings) do
        if typeof(value) == "Color3" then
            Lighting[property] = lerpColor3(Lighting[property], value, 0.1)
        else
            Lighting[property] = Lighting[property] + (value - Lighting[property]) * 0.1
        end
    end
    
    -- Update atmosphere properties
    for property, value in pairs(atmSettings) do
        if typeof(value) == "Color3" then
            atmosphere[property] = lerpColor3(atmosphere[property], value, 0.1)
        else
            atmosphere[property] = atmosphere[property] + (value - atmosphere[property]) * 0.1
        end
    end
end

-- Main cycle loop
local currentTime = 0
RunService.Heartbeat:Connect(function(dt)
    currentTime = currentTime + dt / CYCLE_DURATION
    if currentTime >= 1 then
        currentTime = 0
    end
    
    updateLighting(currentTime)
end)

-- Optional: Add clouds and stars
local function createSkyEffects()
    local sky = Instance.new("Sky")
    sky.Parent = Lighting
    sky.MoonAngularSize = 11
    sky.SunAngularSize = 21
    sky.StarCount = 3000
end

createSkyEffects()`
  },
  {
    id: "env-2",
    title: "Day/Night Cycle System",
    description: "Advanced day/night cycle with smooth transitions, dynamic lighting, and atmospheric effects.",
    difficulty: "Hard",
    tags: ["Environment", "Lighting", "Atmosphere"],
    type: "utility",
    code: `local Lighting = game:GetService("Lighting")
local TweenService = game:GetService("TweenService")
local RunService = game:GetService("RunService")

-- Configuration
local CYCLE_DURATION = 600 -- 10 minutes per full day
local DAWN_TIME = 0.25 -- 6:00 AM
local NOON_TIME = 0.5 -- 12:00 PM
local DUSK_TIME = 0.75 -- 6:00 PM
local NIGHT_TIME = 1.0 -- 12:00 AM

-- Time settings for different periods
local TimeSettings = {
    Dawn = {
        ClockTime = 6,
        Ambient = Color3.fromRGB(150, 150, 170),
        Brightness = 1,
        ColorShift_Bottom = Color3.fromRGB(205, 167, 132),
        ColorShift_Top = Color3.fromRGB(245, 184, 146),
        OutdoorAmbient = Color3.fromRGB(185, 178, 167),
        ShadowSoftness = 0.2,
        ExposureCompensation = 0.2
    },
    Noon = {
        ClockTime = 12,
        Ambient = Color3.fromRGB(200, 200, 200),
        Brightness = 2,
        ColorShift_Bottom = Color3.fromRGB(255, 255, 255),
        ColorShift_Top = Color3.fromRGB(255, 255, 255),
        OutdoorAmbient = Color3.fromRGB(150, 150, 150),
        ShadowSoftness = 0.1,
        ExposureCompensation = 0
    },
    Dusk = {
        ClockTime = 18,
        Ambient = Color3.fromRGB(150, 130, 170),
        Brightness = 1,
        ColorShift_Bottom = Color3.fromRGB(145, 112, 147),
        ColorShift_Top = Color3.fromRGB(180, 128, 164),
        OutdoorAmbient = Color3.fromRGB(163, 145, 167),
        ShadowSoftness = 0.3,
        ExposureCompensation = 0.1
    },
    Night = {
        ClockTime = 0,
        Ambient = Color3.fromRGB(70, 70, 100),
        Brightness = 0.5,
        ColorShift_Bottom = Color3.fromRGB(50, 50, 80),
        ColorShift_Top = Color3.fromRGB(80, 80, 120),
        OutdoorAmbient = Color3.fromRGB(60, 60, 90),
        ShadowSoftness = 0.4,
        ExposureCompensation = 0.4
    }
}

-- Atmosphere settings
local AtmosphereSettings = {
    Dawn = {
        Density = 0.3,
        Offset = 0.25,
        Color = Color3.fromRGB(199, 175, 166),
        Decay = Color3.fromRGB(92, 60, 14),
        Glare = 0.3,
        Haze = 2
    },
    Noon = {
        Density = 0.2,
        Offset = 0,
        Color = Color3.fromRGB(199, 199, 199),
        Decay = Color3.fromRGB(92, 92, 92),
        Glare = 0.4,
        Haze = 1
    },
    Dusk = {
        Density = 0.3,
        Offset = 0.25,
        Color = Color3.fromRGB(199, 166, 175),
        Decay = Color3.fromRGB(92, 14, 60),
        Glare = 0.3,
        Haze = 2
    },
    Night = {
        Density = 0.4,
        Offset = 0.5,
        Color = Color3.fromRGB(166, 166, 199),
        Decay = Color3.fromRGB(14, 14, 92),
        Glare = 0.1,
        Haze = 3
    }
}

-- Create atmosphere if it doesn't exist
local atmosphere = Instance.new("Atmosphere")
atmosphere.Parent = Lighting

-- Lerp function for Color3 values
local function lerpColor3(a, b, t)
    return Color3.new(
        a.R + (b.R - a.R) * t,
        a.G + (b.G - a.G) * t,
        a.B + (b.B - a.B) * t
    )
end

-- Get settings based on current time
local function getSettings(currentTime)
    local settings = {}
    local atmSettings = {}
    
    if currentTime < DAWN_TIME then
        local t = currentTime / DAWN_TIME
        settings = TimeSettings.Night
        atmSettings = AtmosphereSettings.Night
    elseif currentTime < NOON_TIME then
        local t = (currentTime - DAWN_TIME) / (NOON_TIME - DAWN_TIME)
        settings = TimeSettings.Dawn
        atmSettings = AtmosphereSettings.Dawn
    elseif currentTime < DUSK_TIME then
        local t = (currentTime - NOON_TIME) / (DUSK_TIME - NOON_TIME)
        settings = TimeSettings.Noon
        atmSettings = AtmosphereSettings.Noon
    else
        local t = (currentTime - DUSK_TIME) / (NIGHT_TIME - DUSK_TIME)
        settings = TimeSettings.Dusk
        atmSettings = AtmosphereSettings.Dusk
    end
    
    return settings, atmSettings
end

-- Update lighting
local function updateLighting(currentTime)
    local settings, atmSettings = getSettings(currentTime)
    
    -- Update lighting properties
    for property, value in pairs(settings) do
        if typeof(value) == "Color3" then
            Lighting[property] = lerpColor3(Lighting[property], value, 0.1)
        else
            Lighting[property] = Lighting[property] + (value - Lighting[property]) * 0.1
        end
    end
    
    -- Update atmosphere properties
    for property, value in pairs(atmSettings) do
        if typeof(value) == "Color3" then
            atmosphere[property] = lerpColor3(atmosphere[property], value, 0.1)
        else
            atmosphere[property] = atmosphere[property] + (value - atmosphere[property]) * 0.1
        end
    end
end

-- Main cycle loop
local currentTime = 0
RunService.Heartbeat:Connect(function(dt)
    currentTime = currentTime + dt / CYCLE_DURATION
    if currentTime >= 1 then
        currentTime = 0
    end
    
    updateLighting(currentTime)
end)

-- Optional: Add clouds and stars
local function createSkyEffects()
    local sky = Instance.new("Sky")
    sky.Parent = Lighting
    sky.MoonAngularSize = 11
    sky.SunAngularSize = 21
    sky.StarCount = 3000
end

createSkyEffects()`
  }
];
