import React from "react";
import { Helmet } from "react-helmet";
import { useSearch } from "../../context/search";
import ProductCard from "../../components/ProductCard";
import OopsNotFound from "../../components/OopsNotFound";

const Search = () => {
  const [values] = useSearch();

  if(values.results.length===0){
    return <OopsNotFound content={`No Products Found with this "${values.query||' '}"search query`} overRideCSS={"my-20 text-2xl"}/>
  }

  return (
    <>
      <Helmet>
        <title>Zapster.com | Search Products</title>
      </Helmet>

     <>
     <h1 className="text-center p-3 font-bold text-4xl">Search Results-"{values.query}"</h1>
     <p className="text-center text-xl font-semibold">{values.results.length} {values.results.length > 1 ? "results" : "result" } found</p>
     <div className="grid md:grid-cols-4 gap-4 md:mx-14 my-8 grid-cols-2 mx-8">
        {values && values?.results?.map((product) => (
          <ProductCard product={product} key={product._id} />
        ))}
      </div>
     
     </>
    </>
  );
};

export default Search;
