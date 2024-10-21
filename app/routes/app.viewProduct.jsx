
import {  useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { DataTable,Page } from "@shopify/polaris";

export async function loader({request}){
  const { admin }= await authenticate.admin(request);

  const response = await admin.graphql(`#graphql
    query {
  products(first:10){
    edges{
      node{
        title
        description
        vendor
        priceRangeV2{ maxVariantPrice{
              amount
                }}
       
      }
    }
  }
}`);
const data = await response.json();


 return data.data.products.edges;
}


export default function ViewProduct() {

  const productData = useLoaderData();
  let rows = [];

  for(let i = 0; i<productData.length; i++){
    let result = [];
    result.push(productData[i].node.title, productData[i].node.description, productData[i].node.vendor,
      productData[i].node.priceRangeV2.maxVariantPrice.amount);
    rows.push(result);
  }
  
  console.log(rows);
  return (
    <Page>
   <DataTable
    columnContentTypes={[
            'text',
            'text',
            'text',
            'numeric',
          ]}
    headings={[
            'Product',
            'Description',
            'Vendor',
            'Price',
          ]}
          rows={rows}
          >
   </DataTable>
   </Page>
  );
}

