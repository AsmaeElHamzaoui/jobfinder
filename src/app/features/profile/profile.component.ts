// src/app/features/profile/profile.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from './service/profile.service';
import { User } from '../../shared/models/user.model';
import { HeaderComponent } from '../../shared/components/header';
import { FooterComponent } from '../../shared/components/footer';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private profileService = inject(ProfileService);
  private router = inject(Router);

  user: User | null = null;
  editMode = false;
  changePasswordMode = false;
  loading = false;

  // Formulaire d'édition
  editForm = {
    firstName: '',
    lastName: '',
    email: ''
  };

  // Formulaire de changement de mot de passe
  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  // Messages
  successMessage = '';
  errorMessage = '';
  passwordError = '';
  passwordSuccess = '';

  ngOnInit(): void {
    console.log('🔵 ProfileComponent - Initialisation');
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.user = this.authService.getCurrentUser();
    
    if (this.user) {
      this.editForm = {
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email
      };
      console.log('✅ Profil chargé:', this.user);
    } else {
      console.warn('⚠️ Aucun utilisateur connecté');
      this.router.navigate(['/login']);
    }
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    this.successMessage = '';
    this.errorMessage = '';
    
    if (!this.editMode && this.user) {
      // Annuler les modifications
      this.editForm = {
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email
      };
    }
  }

  togglePasswordMode(): void {
    this.changePasswordMode = !this.changePasswordMode;
    this.passwordError = '';
    this.passwordSuccess = '';
    
    if (!this.changePasswordMode) {
      this.passwordForm = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
    }
  }

  saveProfile(): void {
    if (!this.user?.id) return;

    // Validation
    if (!this.editForm.firstName.trim() || !this.editForm.lastName.trim() || !this.editForm.email.trim()) {
      this.errorMessage = 'Tous les champs sont obligatoires';
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.editForm.email)) {
      this.errorMessage = 'Email invalide';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const updatedData: Partial<User> = {
      firstName: this.editForm.firstName.trim(),
      lastName: this.editForm.lastName.trim(),
      email: this.editForm.email.trim()
    };

    this.profileService.updateProfile(this.user.id, updatedData)
      .subscribe({
        next: (updatedUser) => {
          // Mettre à jour le localStorage
          const userToStore = { ...updatedUser };
          delete userToStore.password;
          localStorage.setItem('currentUser', JSON.stringify(userToStore));
          
          this.user = userToStore;
          this.successMessage = '✅ Profil mis à jour avec succès';
          this.editMode = false;
          this.loading = false;
          
          console.log('✅ Profil mis à jour');
        },
        error: (err) => {
          console.error('❌ Erreur mise à jour profil:', err);
          this.errorMessage = 'Erreur lors de la mise à jour du profil';
          this.loading = false;
        }
      });
  }

  changePassword(): void {
    if (!this.user?.id) return;

    // Validation
    if (!this.passwordForm.currentPassword || !this.passwordForm.newPassword || !this.passwordForm.confirmPassword) {
      this.passwordError = 'Tous les champs sont obligatoires';
      return;
    }

    if (this.passwordForm.newPassword.length < 6) {
      this.passwordError = 'Le nouveau mot de passe doit contenir au moins 6 caractères';
      return;
    }

    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.passwordError = 'Les mots de passe ne correspondent pas';
      return;
    }

    this.loading = true;
    this.passwordError = '';
    this.passwordSuccess = '';

    // Vérifier l'ancien mot de passe
    this.profileService.verifyPassword(this.user.id, this.passwordForm.currentPassword)
      .subscribe({
        next: (isValid) => {
          if (!isValid) {
            this.passwordError = 'Mot de passe actuel incorrect';
            this.loading = false;
            return;
          }

          // Mettre à jour le mot de passe
          this.profileService.updatePassword(this.user!.id!, this.passwordForm.newPassword)
            .subscribe({
              next: () => {
                this.passwordSuccess = '✅ Mot de passe modifié avec succès';
                this.passwordForm = {
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: ''
                };
                this.loading = false;
                this.changePasswordMode = false;
                
                console.log('✅ Mot de passe mis à jour');
              },
              error: (err) => {
                console.error('❌ Erreur changement mot de passe:', err);
                this.passwordError = 'Erreur lors du changement de mot de passe';
                this.loading = false;
              }
            });
        },
        error: (err) => {
          console.error('❌ Erreur vérification mot de passe:', err);
          this.passwordError = 'Erreur lors de la vérification du mot de passe';
          this.loading = false;
        }
      });
  }

  deleteAccount(): void {
    if (!this.user?.id) return;

    const confirmDelete = confirm(
      '⚠️ ATTENTION ⚠️\n\n' +
      'Êtes-vous vraiment sûr de vouloir supprimer votre compte ?\n\n' +
      'Cette action est IRRÉVERSIBLE et entraînera la suppression de :\n' +
      '• Vos informations personnelles\n' +
      '• Vos favoris\n' +
      '• Vos candidatures suivies\n\n' +
      'Tapez "SUPPRIMER" pour confirmer.'
    );

    if (!confirmDelete) return;

    const finalConfirm = prompt('Tapez "SUPPRIMER" en majuscules pour confirmer :');
    
    if (finalConfirm !== 'SUPPRIMER') {
      alert('Suppression annulée');
      return;
    }

    this.loading = true;

    this.profileService.deleteAccount(this.user.id)
      .subscribe({
        next: () => {
          console.log('✅ Compte supprimé');
          alert('Votre compte a été supprimé avec succès');
          this.authService.logout();
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('❌ Erreur suppression compte:', err);
          alert('Erreur lors de la suppression du compte');
          this.loading = false;
        }
      });
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.passwordError = '';
    this.passwordSuccess = '';
  }
}