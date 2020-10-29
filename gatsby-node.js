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

  data.get_lollies.getLollies.forEach(node => {
    createPage({
      path: `/${node.color1}`,
      component: path.resolve("./src/templates/template.tsx"),
      context: {
        color1: node.color1,
      },
    })
  })
}
