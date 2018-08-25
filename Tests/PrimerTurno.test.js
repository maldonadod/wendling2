const AssertEquals = (a, b) => expect(a).toEqual(b)
const AssertTruth = (a) => expect(a).toBeTruthy()

const NuevoResultado = ({ganador}) => {

    return {
        ganador
    }
}

const NuevaPartida = () => {
    let apuesta_actual;
    const dados = [3, 4, 4, 5, 5, 5];
    
    return {
        next(apuesta) {
            apuesta_actual = apuesta
        },
        apuestaActualEquals(apuesta) {
            return apuesta_actual.equals(apuesta)
        },
        verificar(jugador) {
            if (apuesta_actual.check(dados)) {
                return NuevoResultado({
                    ganador: jugador
                })
            } else {
                return NuevoResultado({
                    ganador: apuesta_actual.jugador
                })
            }
        }
    }
}
const NuevoJugador = name => {
    return {
        name,
        apuesta(value, count) {
            return NuevaApuesta(value, count, this)
        },
        verifica(partida) {
            return partida.verificar(this)
        }
    }
}
const NuevaApuesta = (value, count, jugador) => {
    return {
        count, value, jugador,
        check(dados) {
            const d = dados.filter(v => v === value)
            const l = d.length
            return l <= count
        },
        equals(apuesta) {
            return apuesta.count === count && apuesta.value === value
        }
    }
}

describe('Apuestas', () => {

    it('pepe apuesta 5x3', () => {

        const partida = NuevaPartida()
        const pepe = NuevoJugador('pepe')

        partida.next(pepe.apuesta(5, 3))

        AssertTruth(partida.apuestaActualEquals(NuevaApuesta(5, 3, pepe)))
    })
    it('pepe apuesta 5x4', () => {

        const partida = NuevaPartida()
        const pepe = NuevoJugador('pepe')

        partida.next(pepe.apuesta(5, 4))

        AssertTruth(partida.apuestaActualEquals(NuevaApuesta(5, 4, pepe)))
    })
})

describe('Verificacion', () => {

    it('juan verifica sobre pepe y gana', () => {

        const partida = NuevaPartida()
        const pepe = NuevoJugador('pepe')
        const juan = NuevoJugador('juan')

        partida.next(pepe.apuesta(5, 5))

        AssertEquals(juan.verifica(partida), NuevoResultado({
            ganador: juan
        }))
    })
    it('juan verifica sobre pepe y pierde', () => {

        const partida = NuevaPartida()
        const pepe = NuevoJugador('pepe')
        const juan = NuevoJugador('juan')

        partida.next(pepe.apuesta(5, 2))

        AssertEquals(juan.verifica(partida), NuevoResultado({
            ganador: pepe
        }))
    })
})