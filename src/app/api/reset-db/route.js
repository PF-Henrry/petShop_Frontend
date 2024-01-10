import { leerDesdeJSON } from "@/libs/handleJSON";
import { connectDB,conn } from "@/libs/mongodb";
import { addProduct } from "@/libs/createProductWithRelation";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const datos = leerDesdeJSON('Products.json');
        const newProduct = datos.map((producto) =>{
        
        const newSpecies = producto.species.map((specie) => specie.name);
        const newCategories = producto.category.map((category) => category.name);

         return   ({
                active: producto.active,
                stock: parseInt(producto.stock),
                name: producto.name,
                price: parseInt(producto.price),
                detail: producto.detail,
                image: producto.image,
                brand: producto.brand.name,
                species:[...newSpecies],
                category:[...newCategories]
            })
        } )
    
        if(!newProduct.length) throw TypeError('No hay productos en el arreglo');
        for(let product of newProduct){
          await addProduct(product);
        }

        return NextResponse.json(newProduct,{status:200})
    } catch (error) {
        console.log(error)
        return NextResponse.json(error.message,{status:400})
    }
}