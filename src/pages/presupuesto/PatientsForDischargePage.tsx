import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
} from "@mui/material";
import { useAtom } from "jotai";
import { epicrisisAtom } from "../../stores/epicrisisStore";
import { Epicrisis } from "../../types/epicrisis";
import { patientBudgetsAtom, addPatientBudgetAtom } from "../../stores/budgetStore";
import { PatientBudget } from "../../types/budget";

const PatientsForDischargePage: React.FC = () => {
  const [epicrisisList] = useAtom(epicrisisAtom);
  const [budgets] = useAtom(patientBudgetsAtom);
  const [, addBudget] = useAtom(addPatientBudgetAtom);

  const patientsForDischarge = epicrisisList.filter(
    (ep) => ep.tipoAlta === "alta_medica" || ep.tipoAlta === "alta_voluntaria"
  );

  const handleCreateBudget = (epicrisis: Epicrisis): void => {
    const existingBudget = budgets.find((b) => b.pacienteId === epicrisis.pacienteId);
    if (existingBudget) return;

    const newBudget: PatientBudget = {
      id: `budget-${Date.now()}`,
      pacienteId: epicrisis.pacienteId,
      fechaIngreso: epicrisis.fechaIngreso,
      fechaAlta: epicrisis.fechaAlta,
      servicios: [],
      medicamentos: [],
      estudios: [],
      total: 0,
      estado: "pendiente",
    };

    addBudget(newBudget);
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Pacientes para Alta
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total de pacientes con alta médica: {patientsForDischarge.length}
        </Typography>
      </Paper>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Paciente</TableCell>
              <TableCell>Fecha Ingreso</TableCell>
              <TableCell>Fecha Alta</TableCell>
              <TableCell>Tipo Alta</TableCell>
              <TableCell>Estado Presupuesto</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patientsForDischarge.map((epicrisis) => {
              const budget = budgets.find((b) => b.pacienteId === epicrisis.pacienteId);
              return (
                <TableRow key={epicrisis.id} hover>
                  <TableCell>{epicrisis.pacienteId}</TableCell>
                  <TableCell>{epicrisis.fechaIngreso}</TableCell>
                  <TableCell>{epicrisis.fechaAlta}</TableCell>
                  <TableCell>
                    <Chip
                      label={epicrisis.tipoAlta.replace("_", " ")}
                      color={epicrisis.tipoAlta === "alta_medica" ? "success" : "info"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {budget ? (
                      <Chip
                        label={budget.estado}
                        color={budget.estado === "aprobado" ? "success" : "warning"}
                        size="small"
                      />
                    ) : (
                      <Chip label="Sin presupuesto" color="default" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    {!budget && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleCreateBudget(epicrisis)}
                      >
                        Crear Presupuesto
                      </Button>
                    )}
                    {budget && (
                      <Button variant="outlined" size="small" href={`/detalles-cuenta?budget=${budget.id}`}>
                        Ver Detalles
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PatientsForDischargePage;

