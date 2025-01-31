import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  userName: string = '';

  constructor(private router: Router) {}

  login() {
    if (this.userName.trim()) {
      // Guardar el nombre de usuario en el localStorage
      localStorage.setItem('userName', this.userName);
      // Redirigir al chat público
      this.router.navigate(['/chat']);
    }
  }
}
