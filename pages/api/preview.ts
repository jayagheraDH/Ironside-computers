import { NextApiRequest, NextApiResponse } from "next";

export default async function preview(req: NextApiRequest, res: NextApiResponse) {

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({})

  // Redirect to the entry location
  let slug = req.query.slug

  // Handle home slug 
  if(slug === 'home') {
      slug = ''
  }

  // Redirect to the path from entry
  res.redirect(`/${slug}`)
}