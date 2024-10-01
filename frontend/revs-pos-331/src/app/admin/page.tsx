"use client";
import React, { useState, FormEvent, useEffect } from "react";
import axios from "axios";
import {
    Modal,
    Button,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,

} from "@nextui-org/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import type { users } from "@prisma/client";
import "./page.css";
import { act } from "@testing-library/react";

/**
 * @component Admin Component
 * 
 * This component is responsible for rendering the Admin page. Within this page, the admin can add, delete, and edit users.
 * To add a user, you need to input a name, email, and permission level(admin, manager, cashier, customer).
 * 
 * @returns {JSX.Element} - Returns the Admin page.
 */
export default function Admin() {
   //for adding a user
  /**
   * @type {string} userName - The name of the user to be added.
   * @type {string} userEmail - The email of the user to be added.
   * @type {number} userPermissions - The permission level of the user to be added. (1: customer, 2: cashier, 3: manager, 4: admin)
   * 
   */
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPermissions, setUserPermissions] = useState(1);

  //for getting all users in the database
   /**
   * @type {users[]} users - An array of all users in the database. (users is a prisma object with id, name, email, and permissions level taken from the database)
   */
  const [users, setUsers] = useState<users[]>([]);

  //for deleting a user
   /**
   * @type {string} emailToDelete - The email of the user to be deleted.
   */
  const [emailToDelete, setEmailToDelete] = useState("");

  //for updating a user
   /**
   * @type {string} updatedName - The updated name of the user.
   * @type {string} updatedPermissions - The updated permissions level of the user.
   * @type {boolean} isEditing - A boolean to check if the user is currently being edited.
   * @type {users | null} userToEdit - The user object that is currently being edited. (is set to null when no user is being edited)
   */
  const [updatedName, setUpdatedName] = useState("");
  const [updatedPermissions, setUpdatedPermissions] = useState("customer");
  const [isEditing, setIsEditing] = useState(false);
  const [userToEdit, setUserToEdit] = useState<users | null>(null);

  /**
   * This function is called when the edit button is clicked. It uses the user object to set the user to edit and sets the editting state to true.
   * @namespace
   * @param user - The user object that is being edited.
   * @returns {void} - This function does not return anything.
   */
  function handleEdit(user: users) {
    setUserToEdit(user);
    setIsEditing(true);
  }

  /**
   * This function is called when the close button is clicked. It sets the editting state to false.
   * @namespace
   * @returns {void} - This function does not return anything.
   */
  function handleClose() {
    setIsEditing(false);
  }
  /**
     * This function is called to get all users from the database. It uses axios to make a get request to the getUsers api and sets the users state. It also sorts the users by name and permissions level. (if the name is the same then sort by permissions level)
     * @namespace
     * @returns {void} - This function does not return anything. 
     */
  async function getUsers() {
    const response = await axios.get("../api/getUsers");
    if(response){
      setUsers(
      response.data.sort((a: users, b:users) => {
        const nameComparison = a.name.localeCompare(b.name);
        if (nameComparison !== 0) {
          return nameComparison;
        }
        //sort by permissions level if same name(want admin first then manager then cashier then customer)
        return (b.permissions || 1) - (a.permissions || 1);
      })
    );
    }
   
  }
  useEffect(() => {
    
    getUsers();
  }, []);

  //create function for adding user
   /**
   * This function is called when the create user form is submitted. It uses the userName, userEmail, and userPermissions states to add a new user to the database. It uses axios to make a post request to the addUser api and sets the users state with the new user. It also resets the userName, userEmail, and userPermissions states after the user is added.
   * @namespace
   * @param event - The event that is triggered when the create user form is submitted.
   * @returns- This function does not return anything.
   */
  async function addUser(event: FormEvent) {
    //prevent the page from refreshing
    event?.preventDefault();
    if (!userName.trim() || !userEmail.trim()) {
      return alert("Please fill out all fields");
    }
    //check if the fields are empty
    if (userName && userEmail && userPermissions) {
      const response = await axios.post("../api/addUser", {
        userName,
        userEmail,
        userPermissions,
      });
      //if the user is added successfully
      if (response.status === 200) {
        //sort the users by name and permissions level
        setUsers((prevUsers) =>
          [...prevUsers, response.data].sort((a, b) => {
            const nameComparison = a.name.localeCompare(b.name);
            if (nameComparison !== 0) {
              return nameComparison;
            }
            return b.permissions - a.permissions;
          })
        );
         //reset the user fields
        setUserName("");
        setUserEmail("");
        setUserPermissions(1);
        //show a success message
        toast.success("User added successfully", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    }
  }
  
   /**
   * This function is called when the delete button is clicked. It uses the emailToDelete state to select which user to delete from the database (since every user is guaranteed a unique email, you can use this field to differentiate between users). It uses axios to make a delete request to the deleteUser api and updates the user state to include all the users except the one just deleted. It also resets the emailToDelete state after the user is deleted.
   * @namespace
   * @param email - The email of the user to be deleted.
   * @returns {void} - This function does not return anything.
   */
  async function deleteUser(email: string) {
    //check if the email is empty
    if (!email.trim()) {
      alert("Cannot delete user with no email");
      return;
    }
    //delete the user
    const response = await axios.delete("../api/deleteUser", {
      data: { userEmail: email },
    });
    //if the user is deleted successfully
    if (response.status === 200) {
      setUsers((prevUsers) => prevUsers.filter((user) => user.email !== email));
      setEmailToDelete("");
      //show a success message
      toast.success("User deleted successfully", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  }

  //only let the admin change the name and permissions of a user
   /**
   * This function is called when the update user form is submitted. It uses the updatedName, updatedPermissions, and userToEdit states to update the user in the database. It uses axios to make a put request to the updateUser api and updates the users state with the updated user information. It also resets the updatedName and updatedPermissions states after the user is updated.
   * @namespace
   * @param event - The event that is triggered when the update user form is submitted.
   * @param email - The email of the user to be updated.
   * @param name - The updated name of the user.
   * @param permissions - The updated permissions level of the user. (type is string but it is converted to a number in the updateUser api route)
   * @returns {void} - This function does not return anything.
   */
  async function updateUser(
    event: FormEvent,
    email: string,
    name: string,
    permissions: string
  ) {
    //prevent the page from refreshing
    event.preventDefault();
    if (!email.trim()) {
      alert("Please enter an email");
      return;
    }
    //find the user to update
    const oldUser = users.find((user: users) => user.email === email);
    if (!oldUser) {
      alert("User does not exist");
      return;
    }
    //get the name
    const oldName:string = oldUser.name;
    //update the user
    const response = await axios.put("../api/updateUser", {
      email,
      name: name.trim() ? name : oldName,
      permissions,
    });
    //if the user is updated successfully
    if (response.status === 200) {
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.email === email ? response.data : user))
      );
      //reset the updated fields
      setUpdatedName("");
      setUpdatedPermissions("1");
      //show a success message
      toast.success("User updated successfully");
    }
  }
   /**
   * Helper function to translate between the permission level number and the permission level name.
   * (1: customer, 2: cashier, 3: manager, 4: admin)
   * @namespace
   * @param level - The permission level number.
   * @returns {string} - The permission level name.
   */
  function permissionNumtoName(level: number) {
    switch (level) {
      case 1:
        return "Customer";
      case 2:
        return "Cashier";
      case 3:
        return "Manager";
      case 4:
        return "Admin";
      default:
        return "Customer";
    }
  }

  return (
    <main className="adminMain">
      <div>
      <Link href="/"><button className="navButton rounded-full">Home</button></Link>
      </div>
      <h1 className="title">Welcome to the Admin Page!</h1>
      <div className="userCreate">
        <h2>Add a new User:</h2>
        <h3>Input a name, email, and permission level of the new user.</h3>
        <form onSubmit={addUser}>
          <label>
            Name:
            <input
              type="text"
              placeholder="Enter Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className= 'Input'
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              placeholder="Enter Email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className= 'Input'
            />
          </label>
          <label>
            <label>
              Permission Level:
              <select
                value={userPermissions}
                onChange={(e) => setUserPermissions(Number(e.target.value))}
                className= 'Input'
                data-testid="user-permissions-select"
              >
                <option value={4}>Admin</option>
                <option value={3}>Manager</option>
                <option value={2}>Cashier</option>
                <option value={1}>Customer</option>
              </select>
              <ToastContainer />
            </label>
          </label>
          <input type="submit" value="Add User" className="addUserButton" />
        </form>
      </div>
      <div className="userList">
        <h2>Current Approved Users:</h2>
        <ul>
          <div className="divTitle">
            <p>Name</p>
            <p>Email</p>
            <p>Permission</p>
            <p>Actions</p>
          </div>
          {users.map((user: users) => (
            <li key={user.id}>
              <p>{user.name}</p>
              <p>{user.email}</p>
              <p>{permissionNumtoName(user.permissions || 1)}</p>
              <div className="editAndDeleteButtons">
                <div className="editButton">
                  <button id="editUserButton" onClick={() => handleEdit(user)}>Edit</button>
                </div>
                <div className="deleteButton">
                  <button onClick={() => deleteUser(user.email)}>Delete</button>
                </div>
              </div>
            </li>
          ))}
          <Modal className="text-black editPopup" isOpen={isEditing} onClose={handleClose} >
            <ModalContent>
            <ModalHeader className="text-black editUserButton">Edit User</ModalHeader>
            <ModalBody>
              <form className="text-black" onSubmit={(e) => { 
                if(userToEdit){e.preventDefault(); updateUser(e, userToEdit.email, updatedName, updatedPermissions); handleClose();}}}>
                <label>
                  Name:
                  <input className="bg-slate-300" type='text' name='newName' defaultValue={userToEdit?.name} value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}/>
                </label>
                <label>
                  Permission Level:
                  <select className="bg-slate-300" name='newPermissions' defaultValue={userToEdit?.permissions ?? '1'} value={updatedPermissions}
                onChange={(e) => setUpdatedPermissions(e.target.value)}>
                    <option value={4}>Admin</option>
                    <option value={3}>Manager</option>
                    <option value={2}>Cashier</option>
                    <option value={1}>Customer</option>
                  </select>
                </label>
                <input type='submit' value='Update User' className="updateUserButton"/>
              </form>
            </ModalBody>
            <ModalFooter>
              <button className = 'closeButton' onClick={handleClose}>Close</button>
            </ModalFooter>
            </ModalContent>
          </Modal>
        </ul>
      </div>
    </main>
  );
}