import React, {useEffect} from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductService from "./services/ProductService.ts";

const App: React.FC = () => {

    const productService=ProductService.getInstance();

    const fetchData=async()=>{
        try{
            const res=await productService.getProductById(1)
            console.log(res)
        }catch(err){
            console.log(err);
        }
    }
    useEffect( ()=>{
        fetchData()
    },[])

    return (
        <>
            <ToastContainer/>
        </>
    );
}


export default App;
