import matter from 'gray-matter'
import { GetStaticPropsContext, NextPage } from 'next'
import ReactMarkdown from 'react-markdown'

type Body = {
    id: string
    title: string
    date: string
    image: string
    except: string
}

type Props = {
  frontmatter: Body 
  markdownBody: string
}

const SingleBlog: NextPage<Props> = (props) => {
  console.log('props: ',props)
  return (
    <>
      <h1>{props.frontmatter.title}</h1>
      <p>{props.frontmatter.date }</p>
      <ReactMarkdown>
        {props.markdownBody}
      </ReactMarkdown>
    </>
  )
}

export default SingleBlog

export async function getStaticPaths() {
  const blogSlugs = ((context) => {
    const keys = context.keys()
    const data = keys.map((key, index) => {
      let slug = key.replace(/^.*[\\\/]/, '').slice(0, -3)
      return slug
    })
    return data
  })(require.context('../../data', true, /\.md$/))
  const paths = blogSlugs.map((blogSlug) => `/blog/${blogSlug}`)
  return {
    paths: paths,
    fallback: false, // falseにすることでpathsに入っているpath以外のパス名に対して404を表示
  }
}

type Params = {
  slug: string
}

export async function getStaticProps(context: GetStaticPropsContext<Params>) {
  const params = context.params
  const data = await import(`../../data/${params?.slug}.md`)
  const singleDocument = matter(data.default)
  return {
    props: {
      frontmatter: singleDocument.data,
      markdownBody: singleDocument.content
    }
  }
}
