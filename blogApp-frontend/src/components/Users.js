import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initializeUsers } from '../reducers/allUsersReducer'
import { Link } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@material-ui/core'
const Users = () => {
  const dispatch = useDispatch()
  const users = useSelector(state => state.allUsers)
  useEffect(() => {
    dispatch(initializeUsers())
  },[])
  return (
    <div>
      <h2>Users</h2>
      <TableContainer component={Paper} style={{ maxHeight: 426, overflow: 'auto' ,background: 'whitesmoke' }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <h3>Usernames</h3>
              </TableCell>
              <TableCell>
                <h3>Blogs created</h3>
              </TableCell>
            </TableRow>
            {users.map(x =>
              <TableRow key={x.id}>
                <TableCell>
                  <Link to={`/users/${x.id}`}>{x.username} </Link>
                </TableCell>
                <TableCell>
                  {x.blogs.length}
                </TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Users