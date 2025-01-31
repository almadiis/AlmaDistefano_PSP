import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../chat-service.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  mensajes: any[] = []; // Array para mensajes recibidos
  mensaje: string = ''; // Mensaje a enviar
  username: string = ''; // Nick personalizado por el usuario
  color: string = this.getRandomColor(); // Color único para el usuario
  conectado: boolean = false;
  imagen: File | null = null;

  constructor(public chatService: ChatService) { }


  ngOnInit(): void {
    this.chatService.getMessages().subscribe((mensaje) => {
      console.log('Nuevo mensaje recibido:', mensaje); // Depuración
      this.mensajes.push(mensaje); // Actualiza el array de mensajes
      console.log('Mensajes actuales:', this.mensajes); // Verifica los mensajes actualizados
    });
  }



  ngOnDestroy(): void {
    this.chatService.desconectar(); // Desconectar al destruir el componente
  }


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imagen = input.files[0]; // Guardar el archivo seleccionado
      console.log('Archivo seleccionado:', this.imagen);
    }
  }

  // Enviar imagen
  enviarImagen(): void {
    if (this.imagen) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageBase64 = reader.result as string;

        const nuevoMensaje = {
          autor: this.username || 'Usuario Anónimo',
          username: this.username || 'Usuario Anónimo',
          color: this.getRandomColor(),
          contenido: '',
          imagen: imageBase64, // Imagen en formato base64
        };

        this.chatService.sendMessage(nuevoMensaje); // Enviar mensaje con imagen
        this.imagen = null; // Limpiar selección de imagen
        console.log('Imagen enviada:', nuevoMensaje);
      };

      reader.readAsDataURL(this.imagen); // Convertir imagen a base64
    }
  }


  enviarMensaje() {
    const nuevoMensaje = {
      autor: this.username || 'Usuario Anónimo',
      username: this.username || 'Usuario Anónimo',
      color: this.getRandomColor(),
      contenido: this.mensaje || 'Imagen enviada',
      imagen: "",
    };

    if (this.imagen) {
      const reader = new FileReader();
      reader.onload = () => {
        nuevoMensaje.imagen = reader.result as string;
        this.chatService.sendMessage(nuevoMensaje);
        this.limpiarCampos();
      };
      reader.readAsDataURL(this.imagen);
    } else {
      this.chatService.sendMessage(nuevoMensaje);
      this.limpiarCampos();
    }
  }

  limpiarCampos() {
    this.mensaje = '';
    this.imagen = null;
  }


  // Obtener un color aleatorio para el usuario
  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }


  conectar() {
    this.chatService.conectar(); // Establecer conexión WebSocket
    this.chatService.getMensajesGuardados().subscribe(
      (mensajes) => {
        this.mensajes = mensajes; // Cargar los mensajes previos desde la base de datos
        console.log('Mensajes cargados desde la base de datos:', this.mensajes);
        this.conectado = true; // Cambiar el estado a conectado
      },
      (error) => {
        console.error('Error al cargar mensajes guardados:', error);
      }
    );
  }
  desconectar() {
    this.chatService.desconectar();
    this.conectado = false; // Cambiar el estado a desconectado
  }
}