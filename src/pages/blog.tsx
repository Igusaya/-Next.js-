import { NextPage } from "next"
import matter from "gray-matter"
import Link from 'next/link'

type Body = {
    id: string
    title: string
    date: string
    image: string
    except: string
}

type Props = {
    blogs: [
        {
            frontmatter: Body 
            slug: string
        }
    ] 
}


const Blog: NextPage<Props> = (props) => {
    console.log('props',props.blogs)
    return (
        <>
            <h1>ブログページ</h1>
            {props.blogs.map((blog, index) =>
                <div key={index} >
                    <h3>{blog.frontmatter.title}</h3>
                    <p>{ blog.frontmatter.date }</p>
                    <Link href={ `/blog/${blog.slug}`}><a>Read More</a></Link>
                </div>
            )}
        </>
    )
}

export default Blog

type BlogType = {
    slug: string;
    frontmatter: matter.GrayMatterFile<string>["data"]
}

export async function getStaticProps() {
    const blogs = ((context): BlogType[] => {
        const keys = context.keys()
        const values = keys.map<{ [key: string]: string }>(context);

        const data = keys.map((key, index) => {
            let slug = key.replace(/^.*[\\\/]/, '').slice(0, -3)
            const value = values[index]
            const document = matter(value.default)

            return {
                slug: slug,
                frontmatter: document.data
            }
        }) 
        return data
    })(require.context('../data', true, /\.md$/))
    return {
        props: {
            blogs: JSON.parse(JSON.stringify(blogs))
        }
    }
}
