import React, { useRef } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
} from "@mui/material";
import {
  CloudUpload,
  Description,
  Delete,
  Download,
} from "@mui/icons-material";
import { InternationConsentDocuments } from "../../../types/internationProcess";

interface ConsentDocumentsStepProps {
  data: InternationConsentDocuments;
  onChange: (data: InternationConsentDocuments) => void;
}

const ConsentDocumentsStep: React.FC<ConsentDocumentsStepProps> = ({
  data,
  onChange,
}) => {
  const consentimientoInformadoRef = useRef<HTMLInputElement>(null);
  const consentimientoQuirurgicoRef = useRef<HTMLInputElement>(null);
  const consentimientoAnestesicoRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (
    field: keyof InternationConsentDocuments
  ) => (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0] || null;
    if (file && file.type === "application/pdf") {
      onChange({
        ...data,
        [field]: file,
      });
    }
  };

  const handleRemoveFile = (
    field: keyof InternationConsentDocuments
  ): void => {
    onChange({
      ...data,
      [field]: null,
    });
  };

  const handleDownloadConsent = (type: string): void => {
    const consentText = `CONSENTIMIENTO INFORMADO - ${type.toUpperCase()}\n\n` +
      `Por medio del presente documento, el paciente o su representante legal ` +
      `manifiesta haber sido informado sobre el procedimiento médico a realizar ` +
      `y consiente de manera libre y voluntaria su ejecución.\n\n` +
      `Fecha: ${new Date().toLocaleDateString("es-ES")}\n` +
      `Paciente: _____________________________\n` +
      `Firma: _____________________________\n`;

    const blob = new Blob([consentText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `consentimiento-${type.toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const documents = [
    {
      key: "consentimientoInformado" as keyof InternationConsentDocuments,
      label: "Consentimiento Informado",
      ref: consentimientoInformadoRef,
    },
    {
      key: "consentimientoQuirurgico" as keyof InternationConsentDocuments,
      label: "Consentimiento Quirúrgico",
      ref: consentimientoQuirurgicoRef,
    },
    {
      key: "consentimientoAnestesico" as keyof InternationConsentDocuments,
      label: "Consentimiento Anestésico",
      ref: consentimientoAnestesicoRef,
    },
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Documentos de Consentimiento
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={() => handleDownloadConsent("informado")}
          sx={{ mr: 2 }}
        >
          Descargar Consentimiento Informado
        </Button>
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={() => handleDownloadConsent("quirurgico")}
          sx={{ mr: 2 }}
        >
          Descargar Consentimiento Quirúrgico
        </Button>
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={() => handleDownloadConsent("anestesico")}
        >
          Descargar Consentimiento Anestésico
        </Button>
      </Box>
      <List>
        {documents.map((doc) => {
          const file = data[doc.key];
          return (
            <ListItem
              key={doc.key}
              component={Paper}
              elevation={1}
              sx={{ mb: 2, p: 2 }}
            >
              <ListItemIcon>
                <Description />
              </ListItemIcon>
              <ListItemText
                primary={doc.label}
                secondary={
                  file
                    ? `Archivo: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`
                    : "No se ha cargado ningún archivo"
                }
              />
              <Box sx={{ display: "flex", gap: 1 }}>
                <input
                  ref={doc.ref}
                  type="file"
                  accept="application/pdf"
                  style={{ display: "none" }}
                  onChange={handleFileChange(doc.key)}
                />
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<CloudUpload />}
                  onClick={() => doc.ref.current?.click()}
                >
                  {file ? "Reemplazar" : "Cargar PDF"}
                </Button>
                {file && (
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleRemoveFile(doc.key)}
                  >
                    <Delete />
                  </IconButton>
                )}
              </Box>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default ConsentDocumentsStep;

