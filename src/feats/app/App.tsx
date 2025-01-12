import { Route, Router } from '@solidjs/router';
import { Default } from '@/feats/defaultPage';
import { AuthPage } from '@/feats/authentication';
import { ProtectedRoute } from '@/feats/protectedRoute';
import { GeneralProvider } from '@/feats/generalProvider';
import { Header } from '@/feats/headerPage';
import { StylingPage } from '@/feats/styles';
import { MainMenu } from '@/feats/mainMenu';

//{/* <div class = "font-mono bg-slate-900 text-white" >*/}
export function App(){
  return (
    <GeneralProvider>
      <Router>
        <Route path="/login" component={ () => (
          <>
            <Header />
            <AuthPage /> 
          </>
        ) } />
        <Route path="/styling" component={ () => (
          <>
            <Header />
            <ProtectedRoute>
              <StylingPage /> 
            </ProtectedRoute>
          </>
        ) }/>
        <Route path="/menu" component={ () => (
          <>
            <Header />
            <ProtectedRoute>
              <MainMenu /> 
            </ProtectedRoute>
          </>
        ) }/>
        <Route path="/" component={ () => (
          <>
            <Header />
            <ProtectedRoute>
              <Default />
            </ProtectedRoute>
          </>
        ) }/>
      </Router>
    </GeneralProvider>
  )
}

function Protected(){
  return (
    <ProtectedRoute>
      <Default />
    </ProtectedRoute>
  )
}