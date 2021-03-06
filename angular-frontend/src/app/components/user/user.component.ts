import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ng4-validators';

@Component({
  selector: 'app-series-pro',
  templateUrl: './user.component.html'
})

export class UserComponent implements OnInit {
  users: User[];
  newUser: User = new User();
  editing: Boolean = false;
  editingUser: User = new User();
  registerForm: FormGroup;
  submitted = false;
  repeatPassword: string;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getUsers();
    this.registerForm = this.formBuilder.group({
            userName: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            birthdate: ['', CustomValidators.date],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  validRepeatPassword(): boolean {
    return this.newUser.password === this.repeatPassword;
  }

  getUsers(): void {
    this.userService.getUsers()
      .then(users => this.users = users );
  }

  createUser(userForm: NgForm): void {
    // this.newUser.id = this.newUser.email;
    this.userService.createUser(this.newUser)
      .then(createUser => {
        userForm.reset();
        this.newUser = new User();
        this.users.unshift(createUser);
      });
  }

  deleteUser(id: string): void {
    this.userService.deleteUser(id)
    .then(() => {
      this.users = this.users.filter(user => user.id !== id);
    });
  }

  updateUser(userData: User): void {
    console.log(userData);
    this.userService.updateUser(userData)
    .then(updatedUser => {
      const existingUser = this.users.find(user => user.id === updatedUser.id);
      Object.assign(existingUser, updatedUser);
      this.clearEditing();
    });
  }

  editUser(userData: User): void {
    this.editing = true;
    Object.assign(this.editingUser, userData);
  }

  clearEditing(): void {
    this.editingUser = new User();
    this.editing = false;
  }

  onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        alert('SUCCESS!! :-)');

  }

}
