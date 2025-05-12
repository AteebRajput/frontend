import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/product-ui/Dialog"
import { Button } from "../ui/product-ui/Button"
import { Input } from "../ui/product-ui/Input"
import { Label } from "../ui/product-ui/Label"
import { Textarea } from "../ui/product-ui/Textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/product-ui/Select"

export default function UpdateProduct({ product, onClose, onUpdate }) {
  const [formData, setFormData] = useState(product)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdate(formData)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input id="category" name="category" value={formData.category} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="seller">Seller</Label>
            <Input id="seller" name="seller" value={formData.seller} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="basePrice">Base Price</Label>
            <Input id="basePrice" name="basePrice" type="number" value={formData.basePrice} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input id="quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="unit">Unit</Label>
            <Select
              name="unit"
              value={formData.unit}
              onValueChange={(value) => handleChange({ target: { name: "unit", value } })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">kg</SelectItem>
                <SelectItem value="g">g</SelectItem>
                <SelectItem value="lb">lb</SelectItem>
                <SelectItem value="oz">oz</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="quality">Quality</Label>
            <Input id="quality" name="quality" value={formData.quality} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" value={formData.location} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="harvestDate">Harvest Date</Label>
            <Input
              id="harvestDate"
              name="harvestDate"
              type="date"
              value={formData.harvestDate}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input id="expiryDate" name="expiryDate" type="date" value={formData.expiryDate} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              name="status"
              value={formData.status}
              onValueChange={(value) => handleChange({ target: { name: "status", value } })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="ended">Ended</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="bidDurationValue">Bid Duration</Label>
            <div className="flex gap-2">
              <Input
                id="bidDurationValue"
                name="bidDurationValue"
                type="number"
                value={formData.bidDuration.value}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bidDuration: { ...prev.bidDuration, value: e.target.value } }))
                }
              />
              <Select
                name="bidDurationUnit"
                value={formData.bidDuration.unit}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, bidDuration: { ...prev.bidDuration, unit: value } }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="submit">Update Product</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

