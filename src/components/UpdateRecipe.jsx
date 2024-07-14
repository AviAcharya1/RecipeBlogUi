import React, { useState, useEffect } from "react";
import "../styles/UpdateRecipe.css";
import { baseUrl } from "../Url";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateRecipe = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({
    title: "",
    ingredients: [],
    instructions: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (location.state && location.state.recipe) {
      const { title, ingredients, instructions, imageUrl } = location.state.recipe;
      setRecipe({
        title,
        ingredients: Array.isArray(ingredients) ? ingredients : ingredients.split(",").map(i => i.trim()),
        instructions,
        imageUrl,
      });
    } else {
      toast.error("Recipe not found.");
      setTimeout(() => navigate("/recipes"), 2000);
    }
  }, [location.state, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      [name]: name === "ingredients" ? value.split(",").map(i => i.trim()).filter(i => i !== "") : value,
    }));
  };

  const handleUpdateRecipe = async () => {
    try {
      if (!recipe.title || recipe.ingredients.length === 0 || !recipe.instructions) {
        toast.warn("Please fill in all required fields.");
        return;
      }

      const response = await fetch(
        `${baseUrl}/auth/recipe/${location.state.recipe._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(recipe),
        }
      );

      if (response.ok) {
        toast.success("Recipe updated successfully!");
        setTimeout(() => navigate("/recipes"), 2000);
      } else {
        const data = await response.json();
        toast.error(data.error || "An error occurred while updating the recipe.");
      }
    } catch (error) {
      console.error("An error occurred while updating the recipe:", error);
      toast.error("An error occurred while updating the recipe.");
    }
  };

  return (
    <div className="update-recipe">
      <h2>Update Recipe</h2>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={recipe.title}
        onChange={handleInputChange}
        required
      />
      <textarea
        name="ingredients"
        placeholder="Ingredients (separated by commas)"
        value={recipe.ingredients.join(", ")}
        onChange={handleInputChange}
        required
      />
      <textarea
        name="instructions"
        placeholder="Instructions"
        value={recipe.instructions}
        onChange={handleInputChange}
        required
      />
      <input
        type="text"
        name="imageUrl"
        placeholder="Image URL"
        value={recipe.imageUrl}
        onChange={handleInputChange}
      />
      <button onClick={handleUpdateRecipe}>Update Recipe</button>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default UpdateRecipe;