import { NextApiRequest, NextApiResponse } from "next"
import axios from 'axios'

const BIGCOMMERCE_STORE_API_TOKEN = process.env.BIGCOMMERCE_STORE_API_TOKEN
const BIGCOMMERCE_STORE_HASH = process.env.BIGCOMMERCE_STORE_HASH

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const result = await axios.get(`https://api.bigcommerce.com/stores/${BIGCOMMERCE_STORE_HASH}/v3/catalog/products/${req.query?.productId}?include=variants,images`, {
    headers: {
      'X-Auth-Token': BIGCOMMERCE_STORE_API_TOKEN,
    }
  })

  res.status(200).json(result.data)
}