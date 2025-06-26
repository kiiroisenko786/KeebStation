import { LockOutlined } from "@mui/icons-material";
import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginSchema } from "../../lib/schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "./accountApi";

export default function LoginForm() {
  const [login, {isLoading}] = useLoginMutation();
  const {register, handleSubmit, formState: {errors}} = useForm<LoginSchema>({
    mode: 'onTouched',
    resolver: zodResolver(loginSchema)
  });
  const navigate = useNavigate();

  const onSubmit = async (data: LoginSchema) => {
    try {
      await login(data).unwrap();
      navigate("/products");
    } catch (error) {
      console.error("Login error:", error);
    }
  }

  return (
    <Container component={Paper} maxWidth="sm" sx={{borderRadius: 3}}>
      <Box display={"flex"} flexDirection={"column"} alignItems={"center"} marginTop="8">
        <LockOutlined sx={{mt: 3, color: "secondary.main"}}/>
        <Typography variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} width="100%" display="flex" flexDirection="column" gap={3} marginY={3}>

          <TextField fullWidth label="Email" autoFocus {...register('email')} error={!!errors.email} helperText={errors.email?.message}/>

          <TextField fullWidth label="Password" type="password" {...register('password')} error={!!errors.password} helperText={errors.password?.message}/>

          <Button disabled={isLoading} variant="contained" type="submit">
            Sign in 
          </Button>
          <Typography sx={{textAlign: "center"}}>
            Don't have an account?{" "}
            <Typography component={Link} to="/register" color="primary">
              Sign Up
            </Typography>
          </Typography>
        </Box>
      </Box>
    </Container>
  )
}

// !! converts the value to a boolean