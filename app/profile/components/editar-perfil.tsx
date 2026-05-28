import Modal from "@/components/modal";
import { useState } from "react";



export default function EditarPerfil({onClose}:any){
    return(
        <Modal onClose={onClose}>
            <div>
                <h1>Editar Perfil</h1>
            </div>
        </Modal>
    );
}