# 「はじめてつくるNext.jsサイト」 で作成するブログアプリをTypeScriptとyarnで作ってみた

[書籍: はじめてつくるNext.jsサイト](https://www.amazon.co.jp/%E3%81%AF%E3%81%98%E3%82%81%E3%81%A6%E3%81%A4%E3%81%8F%E3%82%8BNext-js%E3%82%B5%E3%82%A4%E3%83%88-mod728-ebook/dp/B08ZSB1215)

## 環境
```shell
$ sw_vers
> ProductName:    macOS
> ProductVersion: 12.0.1
> BuildVersion:   21A559

$ node -v
> v16.13.1

$ yarn --version
> 1.22.17
```
---

## P20
```diff
- $ npx create-next-app next-portfolio --use-npm
+ $ yarn create next-app --typescript
```


## P25
```diff
- $ npm run dev
+ $ yarn dev
```

## P33
CSS Modules をtypescriptで使用するにはdファイルを用意する必要がある。
```diff
src
 ├──pages
 │    ├──_app.js
 │    └──index.js
 │      
 └──styles
       ├──globals.css
       ├──index.module.css      ←作成
+      └──index.module.css.d.ts ←追加作成
```

index.module.css.d.ts
```ts
export const h1Text: string;
```

## P49
書き換えは無いが、ハマったのでメモ
xxx-blog.md
```md
---
id: "2"  <- :後ろのスペース入れ忘れてハマった
...
```

## P51
tsに読み替えたいときは[TypeSearch](https://www.typescriptlang.org/dt/search?search=)を使って調べる
```diff
- $ npm install raw-loader gray-matter react-markdown
+ $ yarn add ts-raw-loader gray-matter react-markdown
```

## P54-P76

pages/blog.tsx
```diff 
  import { NextPage } from "next"
  import matter from "gray-matter"
  import Link from 'next/link'

+ type Body = {
+   id: string
+   title: string
+   date: string
+   image: string
+   except: string
+ }
+
+ type Props = {
+   blogs: [
+     {
+       frontmatter: Body 
+       slug: string
+     }
+   ] 
+ }

  const Blog: NextPage<Props> = (props) => {
    return (
-     <div>
+     <>
        <h1>ブログページ</h1>
        {props.blogs.map((blog, index) =>
          <div key={index} >
            <h3>{blog.frontmatter.title}</h3>
            <p>{ blog.frontmatter.date }</p>
            <Link href={ `/blog/${blog.slug}`}><a>Read More</a></Link>
          </div>
        )}
-     </div>
+     </>
    )
  }

  export default Blog
  
+ type BlogType = {
+     slug: string;
+     frontmatter: matter.GrayMatterFile<string>["data"]
+ }
  
  export async function getStaticProps() {
-   const blogs = ((context) => {
+   const blogs = ((context): BlogType[] => {
      const keys = context.keys()
-     const values = keys.map(context)
+     const values = keys.map<{ [key: string]: string }>(context)
  
      const data = keys.map((key, index) => {
        let slug = key.replace(/^.*[\\\/]/, '').slice(0, -3)
        const value = values[index]
        const document = matter(value.default)

        return {
          frontmatter: document.data
          slug: slug,
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

```

## P81-P101
pages/blog/[slug].tsx
```diff
  import matter from 'gray-matter'
+ import { GetStaticPropsContext, NextPage } from 'next'
  import ReactMarkdown from 'react-markdown'
  
+ type Body = {
+     id: string
+     title: string
+     date: string
+     image: string
+     except: string
+ }
+ 
+ type Props = {
+   frontmatter: Body 
+   markdownBody: string
+ }
  
- const SingleBlog = (props) => {
+ const SingleBlog: NextPage<Props> = (props) => {
    return (
-     <div>
+     <>
        <h1>{props.frontmatter.title}</h1>
        <p>{props.frontmatter.date }</p>
        <ReactMarkdown>
          {props.markdownBody}
        </ReactMarkdown>
-     </div>
+     </>
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
  
+ type Params = {
+   slug: string
+ }
  
- export async function getStaticProps(context) {
+ export async function getStaticProps(context: GetStaticPropsContext<Params>) {
-   const { slug } = context.params
+   const params = context.params
-   const data = await import(`../../data/${slug}.md`)
+   const data = await import(`../../data/${params?.slug}.md`)
    const singleDocument = matter(data.default)
    return {
      props: {
        frontmatter: singleDocument.data,
        markdownBody: singleDocument.content
      }
    }
  }

```