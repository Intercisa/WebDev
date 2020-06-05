import Search from './models/Search';
import * as searchView from './views/searchView'
import { elements } from './views/base';

/* Global State of the App 
* - Search object
* - Current recipe object
* - Shopping list object
* - Liked recipes
*/
const state = {};

const controllSearch = async () =>{ // same as async function() so we can use await in step 4
    // 1, Get the query from the view
    const query = searchView.getInput();

    if(query){
        // 2, New Search object and add to state
        state.search = new Search(query);

        //3, Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();

        //4, Search for recipes
        await state.search.getResults();

        //5, Render results on UI 
       searchView.renderResults(state.search.result);
       
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controllSearch();
});

