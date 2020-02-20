const _ = require('lodash');
const posts = require('./post');

const postsByPath = _.keyBy(posts, 'path')
function getFrontMatter (path) {
  const p = path.split(/\.|\//)[2]
  return _.get(postsByPath, p)
}


module.exports = (options, ctx) => {
    return {
        name: 'custom',
        async additionalPages() {
            return [
                {
                    path: '/post/',
                    frontmatter: {
                        archive: true
                    }
                },
                {
                    path: '/',
                    frontmatter: {
                        home: true
                    }
                }
            ]
        },
        extendPageData($page) {
            if ($page.path.includes('/archive')) {
                const fm = getFrontMatter($page.path)
                if (fm) {
                    $page.frontmatter = {
                        ...fm,
                        ...$page.frontmatter
                    }
                }
            }
        }
    }
}
