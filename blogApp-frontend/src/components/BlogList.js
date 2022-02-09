import React from 'react'
import { Link } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@material-ui/core'
const BlogList = ({ blogs }) => {


  return (
    <TableContainer component={Paper} style={{ maxHeight: 370, overflow: 'auto', background: 'whitesmoke' }}>
      <Table>
        <TableBody id='Blogs'>
          <TableRow>
            <TableCell>
              <h3>Title</h3>
            </TableCell>
            <TableCell>
              <h3>Author</h3>
            </TableCell>
          </TableRow>
          {blogs.sort((x, y) => y.likes - x.likes).map(blog =>
            <TableRow key={blog.id} testId='blog'>
              <TableCell>
                <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
              </TableCell>
              <TableCell>{blog.author}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default BlogList