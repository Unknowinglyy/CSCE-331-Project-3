import { useState, useEffect } from 'react';
import {
    Input,
    Checkbox,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownSection,
    DropdownItem
} from '@nextui-org/react';

import "./managerpage.css"
interface AddFoodFormData {
    name: string;
    price: number;
    foodType: string;
    isSeasonal: boolean;
    startDate: string | null;
    endDate: string | null;
    items: string[];
    temperature:string;
}

const AddFoodForm: React.FC = () => {
    const [formData, setFormData] = useState<AddFoodFormData>({
        name: '',
        price: 0,
        foodType: '',
        isSeasonal: false,
        startDate: null,
        endDate: null,
        items:[],
        temperature:''
    });
    const [recipe, setRecipe] = useState<string[]>([]);
    const [allIngredients, setAllIngredients] = useState([]);
    const [uncheckedIngredients, setUncheckedIngredients] = useState<string[]>([]);
    const [selectedTemperature, setSelectedTemperature] = useState(''); // Initialize with empty value
    const fetchInventoryItems = async () => {
        try {
            const response = await fetch('/api/inventory'); // Replace with your API endpoint
            const data = await response.json();
            setAllIngredients(data);
        } catch (error) {
            console.error('Error fetching inventory items:', error);
        }
    };
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.type === 'checkbox'
                ? (event.target as HTMLInputElement).checked
                : event.target.value
        });
    };

    const handleDropDown = (value: string) => {
        setFormData({ ...formData, ["foodType"]: value });
    };

    
    const handleTemperatureChange = (selectedValue:string) => {
        setSelectedTemperature(selectedValue);
    };

    const handleDateChange = (name: string, value: string | null) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            setFormData({ ...formData, items: recipe });
            const response = await fetch('/api/menu', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          });
          if (response.ok) {
            // Successfully added food item. Handle success (e.g., clear form, display message)
            //console.log('Food item added successfully!');
            setFormData({ name: '', price: 0, foodType:"", isSeasonal:false, startDate:null,endDate:null,items:[],temperature:''}); // Example: Reset form
            setRecipe([]);
          } else {
            // Handle error from the server
            //console.error('Error adding food item:', await response.text());
          }
        } catch (error) {
          console.error('Error submitting form:', error);
        }
      };


      const foodTypes = [
        {foodID: 1,label: 'Burgers' },
        {foodID: 2,label: 'Sandwiches' },
        {foodID: 3,label: 'Sides' },
        {foodID: 4,label: 'Sauces' },
        {foodID: 5,label: 'Beverages' }
      ];

      useEffect(() => {
            fetchInventoryItems();
            formData.temperature = selectedTemperature; 
            //console.log(recipe)
    },[selectedTemperature] );
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <Input
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    fullWidth // Occupy full width
                />
            </div>
            <div className="mt-2 flex space-x-4"> {/* Simple flex layout */}
                <Input
                    label="Price"
                    name="price"
                    type="number"
                    value={formData.price.toString()}
                    onChange={handleChange}
                    required
                    width="50%"
                />
            </div>
            <div>
                <Dropdown>
                    <DropdownTrigger>
                        <Button 
                        onClick={() => {}}
                        >
                        {formData.foodType || 'Food Category'} 
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu className="h-fit dropdown-menu" aria-label="Dynamic Actions" items={foodTypes}>
                        {(item) => (
                        <DropdownItem className="text-black"
                            key={item.foodID}
                            onClick={() => {handleDropDown(item.label);
                                
                            }}
                        >
                            {item.label}
                        </DropdownItem>
                        )}
                    </DropdownMenu>
                </Dropdown>
            </div>
            <div>
                <div>
                    <div>
                        {recipe.map((ingredient, index) => (
                            
                            <div className="text-white flex" key={index}>
                                
                                <Checkbox
                                
                                    isSelected={true} // TODO: Replace with the correct isSelected value based on the ingredient's presence in the recipe
                                    onChange={() => 
                                        {const updatedRecipe = [...recipe];
                                        updatedRecipe.splice(index, 1);
                                        setRecipe(updatedRecipe);}
                                    }
                                >
                                    <p className="text-white">{ingredient}</p>
                                </Checkbox>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div>
                <Dropdown >
                    <DropdownTrigger >
                        <Button 
                        >
                        Add new ingredient
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu className="h-fit dropdown-menu"aria-label="Static Actions">
                {allIngredients.map((ingredient: { ingredientID: number, name: string }) => (
                    <DropdownItem  className="text-black text-xs"key={ingredient.ingredientID} 
                    onClick={() => {
                        setRecipe([...recipe, ingredient.name]); // Update recipe first
                    
                        // Update formData using a callback in setFormData:
                        setFormData(prevFormData => ({ 
                            ...prevFormData, 
                            items: [...recipe, ingredient.name] // Access the updated recipe array
                        }));
                    }} >{ingredient.name}</DropdownItem>
                    ))}
            </DropdownMenu>
                </Dropdown>
            </div>
            <div>
                <p>{selectedTemperature}</p>
            <Dropdown >
                    <DropdownTrigger >
                        <Button 
                        >
                        Choose temperature
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu className="h-fit dropdown-menu"aria-label="Static Actions">
                        <DropdownItem className="text-black"  onClick={() => handleTemperatureChange('Hot')}>Hot</DropdownItem>
                        <DropdownItem className="text-black"  onClick={() => handleTemperatureChange('Cold')}>Cold</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <div className="mt-2 bg-white w-fit px-4 rounded-xl text-center py-1 ">
                <Checkbox
                    isSelected={formData.isSeasonal}
                    onChange={() => setFormData({ ...formData, isSeasonal: !formData.isSeasonal })}
                >Seasonal</Checkbox>
            </div>
            {formData.isSeasonal && (
                <div className="mt-2 flex space-x-4">
                    <div>
                        <label>Start Date</label>
                        <Input
                            type="date"
                            name="startDate"
                            value={formData.startDate || ''} // Handle potential null value
                            onChange={(event) => handleDateChange('startDate', event.target.value)}
                            width="100%"
                        />
                    </div>
                    <div>
                        <label>End Date</label>
                        <Input
                            type="date"
                            name="endDate"
                            value={formData.endDate || ''}
                            onChange={(event) => handleDateChange('endDate', event.target.value)}
                            width="100%"
                        />
                    </div>
                </div>
            )}
            <div className="mt-4">
                <Button type="submit">Add Food Item</Button>
            </div>
        </form>
    );
};

export default AddFoodForm; 
