import {
  Box,
  Layout,
  Page,
  FormLayout,
  TextField,
  Button

} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import {useState, useCallback} from 'react';
import {Form} from "@remix-run/react";
import { authenticate } from "../shopify.server";


export async function action({request}){

  const {admin,session} = await authenticate.admin(request);

  let productData = await request.formData();
  productData = Object.fromEntries(productData);

  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            variants(first: 10) {
              edges {
                node {
                  
                  price
    
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        input: {
          title: `${productData.title}`,
        },
      },
    },
  );
  const variantResponseJson = await response.json();

 //alert("Product Added");

  return null;
}

export default function AddProduct() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [vendor, setVendor] = useState('');
  const [price, setPrice] = useState(0);
 

  const handleTitleChange = useCallback((value) => setTitle(value), []);

  const handleDescriptionChange = useCallback((value) => setDescription(value), []);

  const handleVendorChange = useCallback((value) => setVendor(value), []);

  const handlePriceChange = useCallback((value) => setPrice(value), []);


  return (
    <Page>
      <TitleBar title="Add Products" />
      <Layout>
        <Layout.Section>
        <Form method = "POST">
      <FormLayout>
        <TextField
          value={title}
          onChange={handleTitleChange}
          label="Product Title"
          name="title"
          type="text"
        />
        <TextField
          value={description}
          onChange={handleDescriptionChange}
          label="Product Description"
          name="description"
          type="text"
        />
        <TextField
          value={vendor}
          onChange={handleVendorChange}
          label="Product Vendor"
          name="vendor"
          type="text"
        />
        <TextField
          value={price}
          onChange={handlePriceChange}
          label="Product Price"
          name="price"
          type="number"
          min="0"
        />

        <Button submit>Submit</Button>
      </FormLayout>
    </Form>
        </Layout.Section>
        
      </Layout>
    </Page>
  );
}

function Code({ children }) {
  return (
    <Box
      as="span"
      padding="025"
      paddingInlineStart="100"
      paddingInlineEnd="100"
      background="bg-surface-active"
      borderWidth="025"
      borderColor="border"
      borderRadius="100"
    >
      <code>{children}</code>
    </Box>
  );
}
