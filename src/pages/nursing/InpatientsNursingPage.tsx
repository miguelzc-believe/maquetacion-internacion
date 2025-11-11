import React, { useMemo, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Paper,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { inpatients } from "../../utils/inpatients";
import { Inpatient } from "../../types/inpatient";
import InpatientCard from "../../components/inpatients/InpatientCard";

const InpatientsNursingPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInpatients = useMemo(() => {
    let filtered: Inpatient[] = inpatients;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (inpatient) =>
          inpatient.pacienteNombre.toLowerCase().includes(term) ||
          inpatient.diagnostico.toLowerCase().includes(term) ||
          inpatient.habitacion.toLowerCase().includes(term) ||
          inpatient.medicoResponsable.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [searchTerm]);

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Pacientes Internados
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Total de pacientes internados: {filteredInpatients.length}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Buscar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              placeholder="Buscar por nombre, diagnóstico, habitación..."
            />
          </Grid>
        </Grid>
      </Paper>

      {filteredInpatients.length === 0 ? (
        <Paper elevation={2} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            No se encontraron pacientes internados
          </Typography>
        </Paper>
      ) : isMobile ? (
        <Grid container spacing={3}>
          {filteredInpatients.map((inpatient) => (
            <Grid item xs={12} key={inpatient.id}>
              <InpatientCard inpatient={inpatient} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Paciente
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Edad
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Días Internado
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Diagnóstico
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Habitación/Cama
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Médico Responsable
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInpatients.map((inpatient) => {
                const diasInternado = Math.floor(
                  (new Date().getTime() - new Date(inpatient.fechaIngreso).getTime()) /
                    (1000 * 60 * 60 * 24)
                );

                return (
                  <TableRow key={inpatient.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {inpatient.pacienteNombre}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{inpatient.edad} años</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{diasInternado} días</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{inpatient.diagnostico}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {inpatient.habitacion} - Cama {inpatient.cama}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{inpatient.medicoResponsable}</Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default InpatientsNursingPage;

