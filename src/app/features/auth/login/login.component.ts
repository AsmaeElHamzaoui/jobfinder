import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

// login.component.ts
onSubmit(): void {
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  this.loading = true;
  this.errorMessage = '';

  const { email, password } = this.loginForm.value;

  this.authService.login(email, password).subscribe({
    next: (user) => {
      console.log('User reçu:', user); // Debug
      
      if (user) {
        // Vérifier que le user est bien stocké
        const storedUser = this.authService.getCurrentUser();
        console.log('User stocké vérifié:', storedUser); // Debug
        
        // Redirection après authentification
        this.router.navigate(['/jobs']);
      } else {
        this.errorMessage = 'Email ou mot de passe incorrect';
        this.loading = false;
      }
    },
    error: (err) => {
      console.error('Erreur login:', err); // Debug
      this.errorMessage = 'Erreur serveur';
      this.loading = false;
    },
    complete: () => {
      this.loading = false;
    }
  });
}

}
