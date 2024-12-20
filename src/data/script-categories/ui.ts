import { Script } from "@/components/ScriptCard";

export const uiScripts: Script[] = [
  {
    id: "ui-1",
    title: "Custom UI Framework",
    description: "A comprehensive UI framework with custom buttons, panels, and animations.",
    difficulty: "Hard",
    tags: ["UI", "Interface", "Animations"],
    type: "utility",
    code: `local TweenService = game:GetService("TweenService")

local UIFramework = {}
UIFramework.__index = UIFramework

-- UI Element Creation
function UIFramework.new()
    local self = setmetatable({}, UIFramework)
    self.elements = {}
    return self
end

function UIFramework:CreateButton(properties)
    local button = Instance.new("TextButton")
    button.Size = properties.Size or UDim2.new(0, 200, 0, 50)
    button.Position = properties.Position or UDim2.new(0.5, -100, 0.5, -25)
    button.BackgroundColor3 = properties.BackgroundColor or Color3.fromRGB(45, 45, 45)
    button.Text = properties.Text or "Button"
    button.TextColor3 = properties.TextColor or Color3.fromRGB(255, 255, 255)
    button.Font = properties.Font or Enum.Font.GothamSemibold
    button.TextSize = properties.TextSize or 14
    button.AutoButtonColor = false
    
    -- Rounded corners
    local corner = Instance.new("UICorner")
    corner.CornerRadius = UDim.new(0, 8)
    corner.Parent = button
    
    -- Hover animation
    button.MouseEnter:Connect(function()
        TweenService:Create(button, TweenInfo.new(0.3), {
            BackgroundColor3 = properties.HoverColor or Color3.fromRGB(60, 60, 60)
        }):Play()
    end)
    
    button.MouseLeave:Connect(function()
        TweenService:Create(button, TweenInfo.new(0.3), {
            BackgroundColor3 = properties.BackgroundColor or Color3.fromRGB(45, 45, 45)
        }):Play()
    end)
    
    return button
end

function UIFramework:CreatePanel(properties)
    local panel = Instance.new("Frame")
    panel.Size = properties.Size or UDim2.new(0, 300, 0, 400)
    panel.Position = properties.Position or UDim2.new(0.5, -150, 0.5, -200)
    panel.BackgroundColor3 = properties.BackgroundColor or Color3.fromRGB(35, 35, 35)
    
    -- Rounded corners
    local corner = Instance.new("UICorner")
    corner.CornerRadius = UDim.new(0, 12)
    corner.Parent = panel
    
    -- Shadow
    local shadow = Instance.new("ImageLabel")
    shadow.Size = UDim2.new(1, 30, 1, 30)
    shadow.Position = UDim2.new(0, -15, 0, -15)
    shadow.BackgroundTransparency = 1
    shadow.Image = "rbxassetid://5554236805"
    shadow.ImageColor3 = Color3.fromRGB(0, 0, 0)
    shadow.ImageTransparency = 0.6
    shadow.Parent = panel
    
    return panel
end

function UIFramework:CreateNotification(properties)
    local notification = Instance.new("Frame")
    notification.Size = UDim2.new(0, 250, 0, 80)
    notification.Position = UDim2.new(1, -270, 1, -100)
    notification.BackgroundColor3 = properties.BackgroundColor or Color3.fromRGB(45, 45, 45)
    
    -- Add text
    local text = Instance.new("TextLabel")
    text.Size = UDim2.new(1, -20, 1, -20)
    text.Position = UDim2.new(0, 10, 0, 10)
    text.BackgroundTransparency = 1
    text.Text = properties.Text or "Notification"
    text.TextColor3 = Color3.fromRGB(255, 255, 255)
    text.TextSize = 14
    text.Font = Enum.Font.GothamSemibold
    text.Parent = notification
    
    -- Animation
    notification.Position = UDim2.new(1, 20, 1, -100)
    TweenService:Create(notification, TweenInfo.new(0.5, Enum.EasingStyle.Quart), {
        Position = UDim2.new(1, -270, 1, -100)
    }):Play()
    
    -- Auto-remove
    task.delay(properties.Duration or 3, function()
        TweenService:Create(notification, TweenInfo.new(0.5, Enum.EasingStyle.Quart), {
            Position = UDim2.new(1, 20, 1, -100)
        }):Play()
        task.wait(0.5)
        notification:Destroy()
    end)
    
    return notification
end

return UIFramework`
  },
  {
    id: "ui-2",
    title: "Inventory System UI",
    description: "A complete inventory system with drag and drop functionality, tooltips, and item management.",
    difficulty: "Extreme",
    tags: ["UI", "Inventory", "Items"],
    type: "utility",
    code: `local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Players = game:GetService("Players")
local TweenService = game:GetService("TweenService")

-- Inventory System
local InventorySystem = {}
InventorySystem.__index = InventorySystem

-- Configuration
local INVENTORY_SIZE = Vector2.new(6, 4)  -- 6x4 grid
local SLOT_SIZE = UDim2.new(0, 60, 0, 60)
local SLOT_PADDING = UDim2.new(0, 5, 0, 5)

function InventorySystem.new(player)
    local self = setmetatable({}, InventorySystem)
    self.Player = player
    self.Items = {}
    self.UI = nil
    self.DraggingItem = nil
    
    self:CreateUI()
    return self
end

function InventorySystem:CreateUI()
    -- Main frame
    local frame = Instance.new("Frame")
    frame.Name = "Inventory"
    frame.Size = UDim2.new(0, 
        (SLOT_SIZE.X.Offset + SLOT_PADDING.X.Offset) * INVENTORY_SIZE.X,
        0,
        (SLOT_SIZE.Y.Offset + SLOT_PADDING.Y.Offset) * INVENTORY_SIZE.Y
    )
    frame.Position = UDim2.new(0.5, -frame.Size.X.Offset/2, 0.5, -frame.Size.Y.Offset/2)
    frame.BackgroundColor3 = Color3.fromRGB(35, 35, 35)
    frame.BackgroundTransparency = 0.1
    
    -- Create slots
    for y = 1, INVENTORY_SIZE.Y do
        for x = 1, INVENTORY_SIZE.X do
            local slot = self:CreateSlot(x, y)
            slot.Parent = frame
        end
    end
    
    -- Add visual effects
    local corner = Instance.new("UICorner")
    corner.CornerRadius = UDim.new(0, 8)
    corner.Parent = frame
    
    local stroke = Instance.new("UIStroke")
    stroke.Color = Color3.fromRGB(255, 255, 255)
    stroke.Transparency = 0.9
    stroke.Parent = frame
    
    self.UI = frame
    return frame
end

function InventorySystem:CreateSlot(x, y)
    local slot = Instance.new("Frame")
    slot.Name = "Slot_" .. x .. "_" .. y
    slot.Size = SLOT_SIZE
    slot.Position = UDim2.new(0,
        (x-1) * (SLOT_SIZE.X.Offset + SLOT_PADDING.X.Offset),
        0,
        (y-1) * (SLOT_SIZE.Y.Offset + SLOT_PADDING.Y.Offset)
    )
    slot.BackgroundColor3 = Color3.fromRGB(45, 45, 45)
    
    -- Add visual effects
    local corner = Instance.new("UICorner")
    corner.CornerRadius = UDim.new(0, 6)
    corner.Parent = slot
    
    local stroke = Instance.new("UIStroke")
    stroke.Color = Color3.fromRGB(255, 255, 255)
    stroke.Transparency = 0.9
    stroke.Parent = slot
    
    -- Make slot interactive
    slot.InputBegan:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseButton1 then
            self:HandleSlotClick(slot)
        end
    end)
    
    return slot
end

function InventorySystem:AddItem(itemData)
    -- Find empty slot
    local emptySlot = self:FindEmptySlot()
    if not emptySlot then return false end
    
    -- Create item visual
    local item = Instance.new("ImageButton")
    item.Size = UDim2.new(0.8, 0, 0.8, 0)
    item.Position = UDim2.new(0.1, 0, 0.1, 0)
    item.Image = itemData.Image
    item.BackgroundTransparency = 1
    
    -- Add tooltip
    local tooltip = Instance.new("TextLabel")
    tooltip.Size = UDim2.new(0, 150, 0, 60)
    tooltip.Position = UDim2.new(1, 10, 0, 0)
    tooltip.BackgroundColor3 = Color3.fromRGB(30, 30, 30)
    tooltip.TextColor3 = Color3.fromRGB(255, 255, 255)
    tooltip.Text = itemData.Name .. "\\n" .. itemData.Description
    tooltip.TextSize = 12
    tooltip.Font = Enum.Font.GothamSemibold
    tooltip.TextWrapped = true
    tooltip.Visible = false
    tooltip.Parent = item
    
    -- Add hover effects
    item.MouseEnter:Connect(function()
        tooltip.Visible = true
        TweenService:Create(item, TweenInfo.new(0.3), {
            Size = UDim2.new(0.9, 0, 0.9, 0),
            Position = UDim2.new(0.05, 0, 0.05, 0)
        }):Play()
    end)
    
    item.MouseLeave:Connect(function()
        tooltip.Visible = false
        TweenService:Create(item, TweenInfo.new(0.3), {
            Size = UDim2.new(0.8, 0, 0.8, 0),
            Position = UDim2.new(0.1, 0, 0.1, 0)
        }):Play()
    end)
    
    -- Make item draggable
    item.MouseButton1Down:Connect(function()
        self:StartDragging(item, itemData)
    end)
    
    item.Parent = emptySlot
    self.Items[emptySlot] = itemData
    return true
end

function InventorySystem:FindEmptySlot()
    for _, child in pairs(self.UI:GetChildren()) do
        if child.Name:match("^Slot") and #child:GetChildren() == 0 then
            return child
        end
    end
    return nil
end

function InventorySystem:StartDragging(item, itemData)
    self.DraggingItem = {
        Item = item,
        Data = itemData,
        OriginalParent = item.Parent
    }
    
    -- Create drag visual
    local dragVisual = item:Clone()
    dragVisual.Position = UDim2.new(0, item.AbsolutePosition.X, 0, item.AbsolutePosition.Y)
    dragVisual.Parent = self.UI
    
    -- Follow mouse
    local connection
    connection = game:GetService("RunService").RenderStepped:Connect(function()
        if self.DraggingItem then
            local mouse = self.Player:GetMouse()
            dragVisual.Position = UDim2.new(0, mouse.X - dragVisual.AbsoluteSize.X/2,
                                          0, mouse.Y - dragVisual.AbsoluteSize.Y/2)
        else
            connection:Disconnect()
            dragVisual:Destroy()
        end
    end)
end

function InventorySystem:HandleSlotClick(slot)
    if self.DraggingItem then
        -- Swap items if target slot has an item
        local targetItem = slot:FindFirstChild("ImageButton")
        if targetItem then
            targetItem.Parent = self.DraggingItem.OriginalParent
            self.Items[slot], self.Items[self.DraggingItem.OriginalParent] =
                self.Items[self.DraggingItem.OriginalParent], self.Items[slot]
        end
        
        -- Move dragged item to new slot
        self.DraggingItem.Item.Parent = slot
        self.Items[slot] = self.DraggingItem.Data
        self.DraggingItem = nil
    end
end

return InventorySystem`
  }
];