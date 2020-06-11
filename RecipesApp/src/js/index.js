import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import { elements, renderLoader, clearLoader } from './views/base';

/* Global State of the App 
* - Search object
* - Current recipe object
* - Shopping list object
* - Liked recipes
*/
const state = {};



/**
 * 
 * SEARCH CONTROLLER 
 * 
 * **/
const controllSearch = async () =>{ // same as async function() so we can use await in step 4
    // 1, Get the query from the view
    const query = searchView.getInput();


    if(query){
        // 2, New Search object and add to state
        state.search = new Search(query);

        //3, Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes)

        try{
        //4, Search for recipes
        await state.search.getResults();

        //5, Render results on UI 
        clearLoader(); 
        searchView.renderResults(state.search.result);
        }catch(err){
            console.log(err);
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controllSearch();
});


elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result,goToPage);
    }
});

/**
 * 
 * RECIPE CONTROLLER 
 * 
 * **/

const controlRecipe = async () => {
    //Get ID from url 
    const id = window.location.hash.replace('#', ' ');
    console.log(id);

    if(id){
        //prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Highlight selected search item
        if(state.search) searchView.highlightSelected(id);
        
        //create a new recipe object
        state.recipe = new Recipe(id);

        try{
        //get recipe data and parse ingredients
        await state.recipe.getRecipe();
        state.recipe.parseIngredients();

        //calculate servings and time 
        state.recipe.calcTime();
        state.recipe.calcServings();

        //render recipe 
        clearLoader();
        recipeView.renderRecipe(state.recipe);
        }catch(err){
            console.log(err);
        }

    }
};

//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


//Handling recipe button clicks
elements.recipe.addEventListener('click', e =>{
    if(e.target.matches('.btn-decrease, .btn-decrease *')){ //* -> any child 
        //Decrease is clicked
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }


    }else if(e.target.matches('.btn-increase, .btn-increase *')){
          //Increase is clicked
          state.recipe.updateServings('inc');
          recipeView.updateServingsIngredients(state.recipe);
    }

    console.log(state.recipe);

});