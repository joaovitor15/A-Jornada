class ErrorMessages {
  // Generic errors
  static const String genericError = 'Ocorreu um erro. Tente novamente.';
  static const String unknownError = 'Erro desconhecido';
  static const String operationFailed = 'Operação falhou';

  // Network errors
  static const String noConnection =
      'Sem conexão com a internet. Verifique sua conexão.';
  static const String timeout =
      'Tempo limite excedido. Tente novamente mais tarde.';
  static const String serverError =
      'Erro no servidor. Tente novamente mais tarde.';
  static const String badRequest = 'Solicitação inválida';
  static const String unauthorized = 'Não autorizado';
  static const String forbidden = 'Acesso proibido';
  static const String notFound = 'Recurso não encontrado';

  // Auth errors
  static const String invalidEmail = 'Email inválido';
  static const String weakPassword =
      'Senha deve ter no mínimo 6 caracteres';
  static const String userNotFound = 'Usuário não encontrado';
  static const String wrongPassword = 'Senha incorreta';
  static const String userAlreadyExists = 'Usuário já existe';
  static const String sessionExpired = 'Sua sessão expirou. Faça login novamente.';
  static const String loginFailed = 'Falha ao fazer login';
  static const String signupFailed = 'Falha ao criar conta';
  static const String logoutFailed = 'Falha ao sair da conta';

  // Validation errors
  static const String emptyField = 'Este campo não pode estar vazio';
  static const String invalidFormat = 'Formato inválido';
  static const String nameTooShort = 'Nome deve ter no mínimo 2 caracteres';
  static const String nameTooLong = 'Nome não pode ter mais de 255 caracteres';
  static const String descriptionTooLong =
      'Descrição não pode ter mais de 500 caracteres';
  static const String invalidAmount = 'Valor deve ser maior que 0';
  static const String amountTooLarge = 'Valor não pode ser maior que 999.999,99';

  // Database errors
  static const String recordNotFound = 'Registro não encontrado';
  static const String duplicateEntry = 'Registro duplicado';
  static const String constraintViolation = 'Violação de restrição do banco';
  static const String databaseError = 'Erro de banco de dados';

  // Profile errors
  static const String profileNotFound = 'Perfil não encontrado';
  static const String profileCreationFailed = 'Falha ao criar perfil';
  static const String profileUpdateFailed = 'Falha ao atualizar perfil';
  static const String profileDeletionFailed = 'Falha ao deletar perfil';
  static const String profileAlreadyExists = 'Perfil já existe';

  // Category errors
  static const String categoryNotFound = 'Categoria não encontrada';
  static const String categoryCreationFailed = 'Falha ao criar categoria';
  static const String categoryUpdateFailed = 'Falha ao atualizar categoria';
  static const String categoryDeletionFailed = 'Falha ao deletar categoria';
  static const String categoryAlreadyExists = 'Categoria já existe';
  static const String categoryDepthExceeded =
      'Profundidade máxima de categorias atingida';

  // Transaction errors
  static const String transactionNotFound = 'Transação não encontrada';
  static const String transactionCreationFailed = 'Falha ao criar transação';
  static const String transactionUpdateFailed = 'Falha ao atualizar transação';
  static const String transactionDeletionFailed = 'Falha ao deletar transação';
  static const String invalidTransactionType = 'Tipo de transação inválido';

  // Tag errors
  static const String tagNotFound = 'Tag não encontrada';
  static const String tagCreationFailed = 'Falha ao criar tag';
  static const String tagUpdateFailed = 'Falha ao atualizar tag';
  static const String tagDeletionFailed = 'Falha ao deletar tag';
  static const String tagAlreadyExists = 'Tag já existe';

  // Success messages
  static const String profileCreatedSuccess = 'Perfil criado com sucesso';
  static const String profileUpdatedSuccess = 'Perfil atualizado com sucesso';
  static const String profileDeletedSuccess = 'Perfil deletado com sucesso';
  static const String categoryCreatedSuccess = 'Categoria criada com sucesso';
  static const String categoryUpdatedSuccess = 'Categoria atualizada com sucesso';
  static const String categoryDeletedSuccess = 'Categoria deletada com sucesso';
  static const String transactionCreatedSuccess =
      'Transação criada com sucesso';
  static const String transactionUpdatedSuccess =
      'Transação atualizada com sucesso';
  static const String transactionDeletedSuccess =
      'Transação deletada com sucesso';
  static const String tagCreatedSuccess = 'Tag criada com sucesso';
  static const String tagUpdatedSuccess = 'Tag atualizada com sucesso';
  static const String tagDeletedSuccess = 'Tag deletada com sucesso';
  static const String loginSuccess = 'Login realizado com sucesso';
  static const String signupSuccess = 'Conta criada com sucesso';
  static const String logoutSuccess = 'Logout realizado com sucesso';
}