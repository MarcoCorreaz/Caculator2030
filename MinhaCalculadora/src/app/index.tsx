import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

type Operacao = '+' | '-' | '*' | '/';

export default function App() {
  const [numero1, setNumero1] = useState('');
  const [numero2, setNumero2] = useState('');
  const [resultado, setResultado] = useState('0');

  const [operacaoAtual, setOperacaoAtual] = useState<Operacao | null>(null);
  const [expressao, setExpressao] = useState('');
  const [calculoFinalizado, setCalculoFinalizado] = useState(false);

  const obterSimbolo = (op: Operacao) => {
    if (op === '+') return '+';
    if (op === '-') return '−';
    if (op === '*') return '×';
    return '÷';
  };

  function calcular(operacao: Operacao) {
    // TODO 1:
    // Verifique se os dois campos foram preenchidos.
    // Se algum campo estiver vazio, apresente uma mensagem
    // e utilize return para interromper a função.
    if (numero1.trim() === '' || numero2.trim() === '') {
      setResultado('Digite os dois números');
      return;
    }

    const n1 = Number(numero1.replace(',', '.'));
    const n2 = Number(numero2.replace(',', '.'));

    // TODO 2:
    // Verifique se os dois valores são números válidos.
    // Utilize Number.isNaN(n1) e Number.isNaN(n2).
    // Se algum valor for inválido, apresente uma mensagem
    // e interrompa a função utilizando return.
    if (Number.isNaN(n1) || Number.isNaN(n2)) {
      setResultado('Digite números válidos');
      return;
    }

    let valor: number = 0;

    // TODO 3:
    // Implemente as quatro operações matemáticas.
    if (operacao === '+') {
      valor = n1 + n2;
    } else if (operacao === '-') {
      valor = n1 - n2;
    } else if (operacao === '*') {
      valor = n1 * n2;
    } else if (operacao === '/') {
      // TODO 4:
      // Verifique se o segundo número é igual a zero.
      // Caso seja zero, apresente uma mensagem informando
      // que não é possível dividir por zero e utilize return.
      // Caso contrário, realize a divisão.
      if (n2 === 0) {
        setExpressao(`${numero1} ÷ ${numero2} =`);
        setResultado('Não é possível dividir por zero');
        setCalculoFinalizado(true);
        return;
      }
      valor = n1 / n2;
    }

    const valorFormatado = Number.isInteger(valor)
      ? String(valor)
      : String(Number(valor.toFixed(8))).replace('.', ',');

    // TODO 5:
    // Atualize o estado resultado para apresentar
    // o valor calculado na tela.
    setExpressao(`${numero1} ${obterSimbolo(operacao)} ${numero2} =`);
    setResultado(String(valorFormatado));
    setNumero1(String(valorFormatado));
    setNumero2('');
    setOperacaoAtual(null);
    setCalculoFinalizado(true);
  }

  function digitarNumero(digito: string) {
    if (calculoFinalizado && !operacaoAtual) {
      setNumero1(digito);
      setNumero2('');
      setExpressao('');
      setResultado(digito);
      setCalculoFinalizado(false);
      return;
    }

    if (!operacaoAtual) {
      const novo = numero1 === '0' ? digito : numero1 + digito;
      setNumero1(novo);
      setResultado(novo);
    } else {
      const novo = numero2 === '0' ? digito : numero2 + digito;
      setNumero2(novo);
      setExpressao(`${numero1} ${obterSimbolo(operacaoAtual)} ${novo}`);
      setResultado(novo);
    }
  }

  function digitarVirgula() {
    if (calculoFinalizado && !operacaoAtual) {
      setNumero1('0,');
      setNumero2('');
      setExpressao('');
      setResultado('0,');
      setCalculoFinalizado(false);
      return;
    }

    if (!operacaoAtual) {
      const base = numero1 === '' ? '0' : numero1;
      if (!base.includes(',') && !base.includes('.')) {
        const novo = base + ',';
        setNumero1(novo);
        setResultado(novo);
      }
    } else {
      const base = numero2 === '' ? '0' : numero2;
      if (!base.includes(',') && !base.includes('.')) {
        const novo = base + ',';
        setNumero2(novo);
        setExpressao(`${numero1} ${obterSimbolo(operacaoAtual)} ${novo}`);
        setResultado(novo);
      }
    }
  }

  function escolherOperacao(op: Operacao) {
    if (numero1 === '') {
      calcular(op);
      return;
    }

    if (operacaoAtual && numero2 !== '') {
      const n1 = Number(numero1.replace(',', '.'));
      const n2 = Number(numero2.replace(',', '.'));
      if (!Number.isNaN(n1) && !Number.isNaN(n2)) {
        if (operacaoAtual === '/' && n2 === 0) {
          calcular('/');
          return;
        }
        const parcial =
          operacaoAtual === '+'
            ? n1 + n2
            : operacaoAtual === '-'
            ? n1 - n2
            : operacaoAtual === '*'
            ? n1 * n2
            : n1 / n2;
        const parcialStr = Number.isInteger(parcial)
          ? String(parcial)
          : String(Number(parcial.toFixed(8))).replace('.', ',');
        setNumero1(parcialStr);
        setNumero2('');
        setOperacaoAtual(op);
        setExpressao(`${parcialStr} ${obterSimbolo(op)}`);
        setResultado(parcialStr);
        setCalculoFinalizado(false);
        return;
      }
    }

    setOperacaoAtual(op);
    setCalculoFinalizado(false);
    setExpressao(`${numero1} ${obterSimbolo(op)}`);
  }

  function pressionarIgual() {
    if (!operacaoAtual) {
      calcular('+');
      return;
    }
    calcular(operacaoAtual);
  }

  function limparTudo() {
    setNumero1('');
    setNumero2('');
    setOperacaoAtual(null);
    setExpressao('');
    setResultado('0');
    setCalculoFinalizado(false);
  }

  function apagarUltimo() {
    if (calculoFinalizado) {
      limparTudo();
      return;
    }

    if (!operacaoAtual) {
      const novo = numero1.slice(0, -1);
      setNumero1(novo);
      setResultado(novo || '0');
    } else {
      const novo = numero2.slice(0, -1);
      setNumero2(novo);
      setExpressao(`${numero1} ${obterSimbolo(operacaoAtual)} ${novo}`);
      setResultado(novo || '0');
    }
  }

  function inverterSinal() {
    if (!operacaoAtual) {
      if (!numero1 || numero1 === '0') return;
      const n = Number(numero1.replace(',', '.'));
      if (Number.isNaN(n)) return;
      const novo = String(-n).replace('.', ',');
      setNumero1(novo);
      setResultado(novo);
    } else {
      if (!numero2 || numero2 === '0') return;
      const n = Number(numero2.replace(',', '.'));
      if (Number.isNaN(n)) return;
      const novo = String(-n).replace('.', ',');
      setNumero2(novo);
      setExpressao(`${numero1} ${obterSimbolo(operacaoAtual)} ${novo}`);
      setResultado(novo);
    }
  }

  function calcularPorcentagem() {
    if (!operacaoAtual) {
      if (!numero1) return;
      const n = Number(numero1.replace(',', '.'));
      if (Number.isNaN(n)) return;
      const novo = String(n / 100).replace('.', ',');
      setNumero1(novo);
      setResultado(novo);
    } else {
      if (!numero2) return;
      const b = Number(numero1.replace(',', '.'));
      const n = Number(numero2.replace(',', '.'));
      if (Number.isNaN(b) || Number.isNaN(n)) return;
      const pct = operacaoAtual === '+' || operacaoAtual === '-' ? (b * n) / 100 : n / 100;
      const novo = String(Number(pct.toFixed(8))).replace('.', ',');
      setNumero2(novo);
      setExpressao(`${numero1} ${obterSimbolo(operacaoAtual)} ${novo}`);
      setResultado(novo);
    }
  }

  const ehMensagem = resultado.length > 12;

  return (
    <View style={styles.screen}>
      <View style={styles.calculadora}>
        <Text style={styles.titulo}>Minha Calculadora</Text>

        {/* Visor da Calculadora */}
        <View style={styles.visor}>
          <Text style={styles.expressaoTexto} numberOfLines={1}>
            {expressao || ' '}
          </Text>
          <Text
            style={[styles.resultado, ehMensagem && styles.resultadoMensagem]}
            numberOfLines={2}
            adjustsFontSizeToFit
          >
            {resultado}
          </Text>
        </View>

        {/* Teclado da Calculadora */}
        <View style={styles.teclado}>
          {/* Linha 1 */}
          <View style={styles.linha}>
            <Pressable
              style={({ pressed }) => [styles.botao, styles.botaoTopo, pressed && styles.botaoPressionado]}
              onPress={limparTudo}
            >
              <Text style={styles.textoBotaoTopo}>AC</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.botao, styles.botaoTopo, pressed && styles.botaoPressionado]}
              onPress={apagarUltimo}
            >
              <Text style={styles.textoBotaoTopo}>⌫</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.botao, styles.botaoTopo, pressed && styles.botaoPressionado]}
              onPress={calcularPorcentagem}
            >
              <Text style={styles.textoBotaoTopo}>%</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.botao,
                styles.botaoOperacao,
                operacaoAtual === '/' && !numero2 && styles.botaoOperacaoAtiva,
                pressed && styles.botaoPressionado,
              ]}
              onPress={() => escolherOperacao('/')}
            >
              <Text
                style={[
                  styles.textoBotaoOperacao,
                  operacaoAtual === '/' && !numero2 && styles.textoBotaoOperacaoAtiva,
                ]}
              >
                ÷
              </Text>
            </Pressable>
          </View>

          {/* Linha 2 */}
          <View style={styles.linha}>
            <Pressable
              style={({ pressed }) => [styles.botao, styles.botaoNumero, pressed && styles.botaoPressionado]}
              onPress={() => digitarNumero('7')}
            >
              <Text style={styles.textoBotaoNumero}>7</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.botao, styles.botaoNumero, pressed && styles.botaoPressionado]}
              onPress={() => digitarNumero('8')}
            >
              <Text style={styles.textoBotaoNumero}>8</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.botao, styles.botaoNumero, pressed && styles.botaoPressionado]}
              onPress={() => digitarNumero('9')}
            >
              <Text style={styles.textoBotaoNumero}>9</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.botao,
                styles.botaoOperacao,
                operacaoAtual === '*' && !numero2 && styles.botaoOperacaoAtiva,
                pressed && styles.botaoPressionado,
              ]}
              onPress={() => escolherOperacao('*')}
            >
              <Text
                style={[
                  styles.textoBotaoOperacao,
                  operacaoAtual === '*' && !numero2 && styles.textoBotaoOperacaoAtiva,
                ]}
              >
                ×
              </Text>
            </Pressable>
          </View>

          {/* Linha 3 */}
          <View style={styles.linha}>
            <Pressable
              style={({ pressed }) => [styles.botao, styles.botaoNumero, pressed && styles.botaoPressionado]}
              onPress={() => digitarNumero('4')}
            >
              <Text style={styles.textoBotaoNumero}>4</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.botao, styles.botaoNumero, pressed && styles.botaoPressionado]}
              onPress={() => digitarNumero('5')}
            >
              <Text style={styles.textoBotaoNumero}>5</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.botao, styles.botaoNumero, pressed && styles.botaoPressionado]}
              onPress={() => digitarNumero('6')}
            >
              <Text style={styles.textoBotaoNumero}>6</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.botao,
                styles.botaoOperacao,
                operacaoAtual === '-' && !numero2 && styles.botaoOperacaoAtiva,
                pressed && styles.botaoPressionado,
              ]}
              onPress={() => escolherOperacao('-')}
            >
              <Text
                style={[
                  styles.textoBotaoOperacao,
                  operacaoAtual === '-' && !numero2 && styles.textoBotaoOperacaoAtiva,
                ]}
              >
                −
              </Text>
            </Pressable>
          </View>

          {/* Linha 4 */}
          <View style={styles.linha}>
            <Pressable
              style={({ pressed }) => [styles.botao, styles.botaoNumero, pressed && styles.botaoPressionado]}
              onPress={() => digitarNumero('1')}
            >
              <Text style={styles.textoBotaoNumero}>1</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.botao, styles.botaoNumero, pressed && styles.botaoPressionado]}
              onPress={() => digitarNumero('2')}
            >
              <Text style={styles.textoBotaoNumero}>2</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.botao, styles.botaoNumero, pressed && styles.botaoPressionado]}
              onPress={() => digitarNumero('3')}
            >
              <Text style={styles.textoBotaoNumero}>3</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.botao,
                styles.botaoOperacao,
                operacaoAtual === '+' && !numero2 && styles.botaoOperacaoAtiva,
                pressed && styles.botaoPressionado,
              ]}
              onPress={() => escolherOperacao('+')}
            >
              <Text
                style={[
                  styles.textoBotaoOperacao,
                  operacaoAtual === '+' && !numero2 && styles.textoBotaoOperacaoAtiva,
                ]}
              >
                +
              </Text>
            </Pressable>
          </View>

          {/* Linha 5 */}
          <View style={styles.linha}>
            <Pressable
              style={({ pressed }) => [styles.botao, styles.botaoNumero, pressed && styles.botaoPressionado]}
              onPress={inverterSinal}
            >
              <Text style={styles.textoBotaoNumero}>+/−</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.botao, styles.botaoNumero, pressed && styles.botaoPressionado]}
              onPress={() => digitarNumero('0')}
            >
              <Text style={styles.textoBotaoNumero}>0</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.botao, styles.botaoNumero, pressed && styles.botaoPressionado]}
              onPress={digitarVirgula}
            >
              <Text style={styles.textoBotaoNumero}>,</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.botao, styles.botaoIgual, pressed && styles.botaoPressionado]}
              onPress={pressionarIgual}
            >
              <Text style={styles.textoBotaoIgual}>=</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  calculadora: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#1E293B',
    borderRadius: 32,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  titulo: {
    color: '#94A3B8',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  visor: {
    backgroundColor: '#0F172A',
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 18,
    minHeight: 120,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  expressaoTexto: {
    color: '#64748B',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 6,
  },
  resultado: {
    color: '#F8FAFC',
    fontSize: 48,
    fontWeight: '700',
    textAlign: 'right',
  },
  resultadoMensagem: {
    fontSize: 22,
    fontWeight: '600',
    color: '#F87171',
  },
  teclado: {
    gap: 12,
  },
  linha: {
    flexDirection: 'row',
    gap: 12,
  },
  botao: {
    flex: 1,
    height: 66,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoPressionado: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
  botaoTopo: {
    backgroundColor: '#334155',
  },
  botaoNumero: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
  },
  botaoOperacao: {
    backgroundColor: '#F59E0B',
  },
  botaoOperacaoAtiva: {
    backgroundColor: '#FDE68A',
  },
  botaoIgual: {
    backgroundColor: '#10B981',
  },
  textoBotaoTopo: {
    color: '#E2E8F0',
    fontSize: 20,
    fontWeight: '600',
  },
  textoBotaoNumero: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: '600',
  },
  textoBotaoOperacao: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
  },
  textoBotaoOperacaoAtiva: {
    color: '#B45309',
  },
  textoBotaoIgual: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
  },
});
