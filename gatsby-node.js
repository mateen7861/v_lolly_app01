const path = require("path")
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const { data } = await graphql(`
    {
      get_lollies {
        getLollies {
          color1
          color2
          color3
          sender
          message
        }
      }
    }
  `)
  console.log("-------------------------------")
  console.log("-------------------------------")
  console.log(data)
  console.log("-------------------------------")
  console.log("-------------------------------")
}
