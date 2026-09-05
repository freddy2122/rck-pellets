<?php

namespace Database\Seeders;

use App\Models\Article;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->articles() as $article) {
            Article::query()->updateOrCreate(
                ['slug' => $article['slug']],
                $article,
            );
        }
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function articles(): array
    {
        return [
            [
                'slug' => 'cuantos-sacos-de-pellets-necesito-invierno',
                'title' => '¿Cuántos sacos de pellets necesito para pasar el invierno?',
                'excerpt' => 'Calcula el consumo real de tu estufa o caldera según los metros de tu vivienda, las horas de uso y la zona climática, con ejemplos y precios por temporada.',
                'meta_description' => 'Calcula cuántos kilos de pellets gasta tu estufa al día, al mes y por temporada según metros, horas de uso y zona climática. Tabla de consumo y coste.',
                'image' => '/images/pellets.jpg',
                'is_published' => true,
                'published_at' => now()->subDays(21),
                'body' => $this->consumo(),
            ],
            [
                'slug' => 'pellets-o-lena-cual-calienta-mas',
                'title' => 'Pellets o leña: cuál calienta más y cuál sale más barato',
                'excerpt' => 'Comparamos poder calorífico, humedad, precio por kWh, autonomía y mantenimiento para que elijas el combustible que mejor encaja con tu vivienda.',
                'meta_description' => 'Pellets frente a leña: poder calorífico, precio por kWh útil, autonomía, cenizas y mantenimiento. Comparativa con cifras para elegir con criterio.',
                'image' => '/images/lenha.jpg',
                'is_published' => true,
                'published_at' => now()->subDays(14),
                'body' => $this->comparativa(),
            ],
            [
                'slug' => 'como-elegir-pellets-calidad-enplus-a1',
                'title' => 'Cómo reconocer pellets de calidad: la certificación ENplus A1',
                'excerpt' => 'Qué significan ENplus A1, A2 y B, qué valores de humedad y cenizas debes exigir, y cómo detectar a simple vista un pellet que dañará tu estufa.',
                'meta_description' => 'Qué exigir a un pellet de calidad: certificación ENplus A1, humedad bajo 10 %, cenizas bajo 0,7 % y durabilidad. Señales visuales de un mal pellet.',
                'image' => '/images/pellets2.jpg',
                'is_published' => true,
                'published_at' => now()->subDays(7),
                'body' => $this->calidad(),
            ],
            [
                'slug' => 'como-almacenar-pellets-y-lena',
                'title' => 'Cómo almacenar pellets y leña sin perder poder calorífico',
                'excerpt' => 'La humedad es el enemigo del rendimiento. Dónde colocar los sacos, cómo apilar la leña y qué errores arruinan una paleta entera en pocas semanas.',
                'meta_description' => 'Guía práctica para almacenar pellets y leña: humedad, ventilación, separación del suelo, apilado correcto y errores que estropean una paleta entera.',
                'image' => '/images/lenha-palete.jpg',
                'is_published' => true,
                'published_at' => now()->subDays(3),
                'body' => $this->almacenamiento(),
            ],
        ];
    }

    private function consumo(): string
    {
        return <<<'HTML'
<p>Es la pregunta que más nos llega antes de comprar la primera paleta: cuántos kilos hacen falta para no quedarse corto en enero. La respuesta depende de cuatro factores, y con ellos se puede estimar el consumo con bastante precisión.</p>

<h2>Los cuatro factores que determinan tu consumo</h2>
<p>El <strong>tamaño de la vivienda</strong> marca la potencia necesaria. Como regla orientativa, en una casa con aislamiento correcto se calcula alrededor de 0,1 kW por metro cuadrado. Un piso de 80 m² pide, por tanto, una estufa de unos 8 kW.</p>
<p>Las <strong>horas de uso</strong> pesan tanto como los metros. No es lo mismo encender por la tarde-noche que mantener la casa templada todo el día.</p>
<p>La <strong>zona climática</strong> cambia la duración de la temporada. En el litoral mediterráneo se calienta de noviembre a marzo; en el interior de Castilla o en zonas de montaña, de octubre a abril y con temperaturas mucho más bajas.</p>
<p>El <strong>aislamiento</strong> es el factor que más varía. Una vivienda anterior a 1980 sin rehabilitar puede consumir un 40 % más que una construcción reciente de la misma superficie.</p>

<h2>Consumo por hora según la potencia</h2>
<p>Una estufa de pellets consume aproximadamente 0,2 kg por hora y por kW de potencia cuando trabaja al máximo. En uso real, con termostato y modulación, el consumo medio se sitúa entre el 40 % y el 60 % de esa cifra.</p>
<table>
<thead><tr><th>Potencia</th><th>Superficie orientativa</th><th>Consumo medio real</th></tr></thead>
<tbody>
<tr><td>6 kW</td><td>Hasta 60 m²</td><td>0,7 a 0,9 kg/h</td></tr>
<tr><td>8 kW</td><td>60 a 90 m²</td><td>0,9 a 1,2 kg/h</td></tr>
<tr><td>10 kW</td><td>90 a 120 m²</td><td>1,2 a 1,5 kg/h</td></tr>
<tr><td>12 kW</td><td>120 a 150 m²</td><td>1,4 a 1,8 kg/h</td></tr>
</tbody>
</table>

<h2>Un ejemplo completo</h2>
<p>Piso de 90 m² en Barcelona, estufa de 8 kW, encendida 8 horas al día de noviembre a marzo.</p>
<ul>
<li>Consumo diario: 8 h × 1,1 kg/h = <strong>8,8 kg</strong>, algo más de medio saco.</li>
<li>Consumo mensual: 8,8 × 30 = <strong>264 kg</strong>, unos 18 sacos.</li>
<li>Temporada de cinco meses: <strong>1.320 kg</strong>, cerca de 88 sacos.</li>
</ul>
<p>Para ese perfil, una paleta de 975 kg cubre la mayor parte del invierno y conviene reservar unos sacos sueltos para los meses de transición. En una vivienda equivalente en zona de interior, con siete meses de temporada y más horas diarias, la cifra sube con facilidad a 1.800 o 2.000 kg.</p>

<h2>Por qué comprar por paletas sale más a cuenta</h2>
<p>El precio por kilo baja de forma apreciable al pasar del saco suelto a la media paleta, y otra vez de la media paleta a la paleta completa. A eso se suma el transporte: una única entrega en lugar de varias compras sueltas a lo largo del invierno.</p>
<p>Hay además un factor de calendario. La demanda se dispara con la primera ola de frío y los precios suben. Comprar en verano o a principios de otoño, cuando el mercado está tranquilo, suele salir bastante mejor.</p>

<h2>Margen de seguridad</h2>
<p>Nuestra recomendación es calcular la temporada y añadir un 15 % de margen. Un invierno más duro de lo previsto, una avería del sistema principal o simplemente unas semanas de teletrabajo cambian el consumo. Los pellets bien almacenados no caducan: lo que sobre servirá el año siguiente.</p>
HTML;
    }

    private function comparativa(): string
    {
        return <<<'HTML'
<p>Pellets y leña son dos formas de biomasa que calientan igual de bien, pero se comportan de manera muy distinta en el día a día. La elección depende menos del precio por kilo que del tipo de vivienda y de la rutina de cada casa.</p>

<h2>Poder calorífico: los números reales</h2>
<p>Un kilo de pellet certificado entrega entre 4,7 y 5,0 kWh. Un kilo de leña de encina o roble bien seca ronda los 4,0 kWh; si está verde o mal almacenada, con un 30 % de humedad, cae hasta 2,8 kWh.</p>
<p>La diferencia no está tanto en la madera como en el <strong>agua</strong>. Toda la humedad presente en el combustible debe evaporarse antes de que la madera arda, y esa energía sale de tu propia estufa. Por eso una leña húmeda calienta poco, ensucia el cristal y llena el tubo de creosota.</p>
<table>
<thead><tr><th>Combustible</th><th>Humedad</th><th>Poder calorífico</th><th>Cenizas</th></tr></thead>
<tbody>
<tr><td>Pellet ENplus A1</td><td>&lt; 10 %</td><td>4,7 a 5,0 kWh/kg</td><td>&lt; 0,7 %</td></tr>
<tr><td>Leña de encina seca</td><td>15 a 20 %</td><td>3,8 a 4,1 kWh/kg</td><td>1 a 2 %</td></tr>
<tr><td>Leña recién cortada</td><td>&gt; 30 %</td><td>2,6 a 2,9 kWh/kg</td><td>2 a 3 %</td></tr>
</tbody>
</table>

<h2>Autonomía y comodidad</h2>
<p>Aquí la diferencia es grande. Una estufa de pellets con depósito de 15 kg funciona sola entre 12 y 30 horas según la potencia, se programa por termostato y se enciende a una hora fija. Una chimenea o estufa de leña exige recargar cada dos o tres horas y no admite programación.</p>
<p>Si pasas el día fuera y quieres llegar a una casa templada, el pellet gana sin discusión. Si buscas el fuego visible de una chimenea las tardes de fin de semana, la leña ofrece algo que el pellet no da.</p>

<h2>Mantenimiento</h2>
<p>El pellet genera muy poca ceniza: vaciar el cajón una vez por semana suele bastar. A cambio, la estufa tiene electrónica, ventilador y sinfín, necesita electricidad para funcionar y una revisión anual de un técnico.</p>
<p>La leña ensucia más y obliga a deshollinar la chimenea al menos una vez al año, pero el aparato es puramente mecánico: sin corriente eléctrica sigue calentando. En zonas con cortes de suministro frecuentes es un argumento de peso.</p>

<h2>Espacio de almacenamiento</h2>
<p>Una paleta de 975 kg de pellets ocupa poco más de un metro cuadrado y se puede guardar en un trastero o un garaje. La misma energía en leña necesita alrededor de 1.200 kg y bastante más volumen, además de un lugar ventilado, ya que la leña debe seguir secándose.</p>

<h2>Entonces, ¿cuál elegir?</h2>
<p>El <strong>pellet</strong> encaja mejor en pisos y viviendas urbanas, cuando se busca calefacción programable, espacio limitado y poco mantenimiento diario.</p>
<p>La <strong>leña</strong> encaja mejor en casas de campo, con chimenea o estufa ya instalada, espacio de almacenamiento amplio y quien disfruta del fuego como parte de la experiencia.</p>
<p>Muchos clientes acaban combinando ambos: pellet para el uso diario y leña para las tardes de chimenea. No son opciones excluyentes.</p>
HTML;
    }

    private function calidad(): string
    {
        return <<<'HTML'
<p>Dos sacos de pellets pueden parecer idénticos y comportarse de forma muy distinta en la estufa. La diferencia está en la materia prima y en el proceso de fabricación, y hay una manera sencilla de asegurarse: la certificación.</p>

<h2>Qué es ENplus y qué significan A1, A2 y B</h2>
<p>ENplus es el sistema de certificación europeo que audita el pellet desde la producción hasta la entrega. Define tres clases:</p>
<ul>
<li><strong>ENplus A1</strong>: madera virgen sin tratar. Menos de 0,7 % de cenizas. Es la clase adecuada para estufas y calderas domésticas.</li>
<li><strong>ENplus A2</strong>: admite corteza y algo más de ceniza, hasta 1,2 %. Pensada para instalaciones mayores.</li>
<li><strong>Clase B</strong>: permite madera reciclada. Solo para instalaciones industriales.</li>
</ul>
<p>Para una vivienda, la respuesta es siempre <strong>A1</strong>. Usar una clase inferior en una estufa doméstica multiplica la ceniza, obliga a limpiar mucho más a menudo y acelera el desgaste del quemador.</p>

<h2>Los cuatro valores que debes mirar</h2>
<p>La <strong>humedad</strong> debe quedar por debajo del 10 %. Cada punto de más es energía que se gasta en evaporar agua en lugar de calentar la casa.</p>
<p>Las <strong>cenizas</strong>, por debajo del 0,7 %. Es lo que notarás a diario: un pellet con 1,5 % de ceniza llena el cajón tres veces más rápido.</p>
<p>La <strong>durabilidad mecánica</strong> debe superar el 97,5 %. Un pellet frágil se deshace en el transporte y llega convertido en serrín, que atasca el sinfín y quema mal.</p>
<p>El <strong>diámetro</strong> normalizado es de 6 mm, con longitudes de entre 3 y 40 mm. Es lo que esperan la práctica totalidad de las estufas domésticas.</p>

<h2>Cómo reconocer un mal pellet a simple vista</h2>
<p>No hace falta un laboratorio. Abre el saco y observa:</p>
<ul>
<li><strong>Mucho polvo en el fondo</strong>: durabilidad baja. Ese serrín no arde bien y ensucia el sistema de alimentación.</li>
<li><strong>Superficie mate y rugosa</strong>: un buen pellet es liso y ligeramente brillante, porque la lignina de la madera se ha fundido durante el prensado.</li>
<li><strong>Color muy oscuro o irregular</strong>: puede indicar corteza o madera de procedencia mixta.</li>
<li><strong>Longitudes muy dispares</strong>: proceso de prensado mal controlado.</li>
<li><strong>Olor a producto químico</strong>: señal de alarma. El pellet debe oler solo a madera.</li>
</ul>
<p>Hay además una prueba casera muy fiable: echa unos pellets en un vaso de agua. Un pellet bien prensado y seco se hunde. Si flota, su densidad es baja y rendirá menos.</p>

<h2>El precio por kilo engaña</h2>
<p>Comparar sacos solo por el precio lleva a decisiones equivocadas. Lo que cuenta es el <strong>coste por kWh útil</strong>. Un pellet un 10 % más barato que rinde un 20 % menos y obliga a limpiar el triple sale más caro en cuanto pasa el primer mes.</p>
<p>Todos los pellets que distribuimos son de madera maciza sin tratar, con certificación y trazabilidad de origen. Es la única forma de garantizar que lo que compras en octubre se comporta igual que lo que compras en febrero.</p>
HTML;
    }

    private function almacenamiento(): string
    {
        return <<<'HTML'
<p>Se puede comprar el mejor pellet del mercado y arruinarlo en tres semanas guardándolo mal. El almacenamiento no es un detalle: es lo que determina si el combustible que pagaste rinde lo que promete.</p>

<h2>La humedad lo decide todo</h2>
<p>El pellet es madera prensada sin aglutinantes. Absorbe humedad del aire con enorme facilidad, y cuando lo hace se hincha, pierde cohesión y acaba deshaciéndose en serrín. Un pellet que ha pasado un invierno en un garaje húmedo puede perder buena parte de su rendimiento y atascar el sinfín de la estufa.</p>
<p>La leña sigue el camino contrario: llega con humedad y necesita seguir secándose. Por eso las reglas de almacenamiento son distintas para cada uno.</p>

<h2>Cómo guardar los pellets</h2>
<ul>
<li><strong>Bajo techo, siempre.</strong> El plástico de la paleta protege del transporte, no de un invierno a la intemperie.</li>
<li><strong>Separados del suelo.</strong> Un palé de madera o unos listones bastan. El hormigón transmite humedad por capilaridad, y es el error más habitual.</li>
<li><strong>Sin contacto con paredes exteriores.</strong> Deja unos centímetros de aire; los muros que dan al exterior condensan.</li>
<li><strong>Lugar seco y ventilado</strong>, no hermético. Un trastero, un garaje seco o un cuarto de calderas funcionan bien.</li>
<li><strong>No apiles más de dos alturas</strong> de sacos sueltos: el peso rompe los pellets de abajo y genera polvo.</li>
</ul>
<p>Si vas a abrir la paleta, retira solo el plástico de la parte superior y baja los sacos según los necesites. Dejar la paleta destapada durante meses expone todo el lote.</p>

<h2>Cómo apilar la leña</h2>
<p>La leña necesita justo lo contrario: <strong>aire</strong>. Una leña de encina recién cortada tarda entre doce y dieciocho meses en bajar del 30 % al 18 % de humedad, y solo lo consigue si el aire circula.</p>
<ul>
<li><strong>Al aire libre pero cubierta por arriba.</strong> Un tejadillo o una lona que cubra solo la parte superior; nunca envuelvas la pila entera.</li>
<li><strong>Elevada del suelo</strong> sobre palés o travesaños, para que no absorba humedad de la tierra.</li>
<li><strong>Apilada en hileras separadas</strong>, con los troncos en la misma dirección y huecos entre ellos.</li>
<li><strong>Orientada al sol y al viento dominante</strong> si es posible. La cara sur seca mucho más rápido.</li>
<li><strong>Separada de la pared</strong> al menos diez centímetros.</li>
</ul>
<p>Una señal práctica: la leña seca suena hueca al golpear dos troncos entre sí, presenta grietas radiales en los extremos y pesa notablemente menos que la verde.</p>

<h2>Errores que arruinan una paleta entera</h2>
<p><strong>Guardar pellets en un sótano sin ventilación.</strong> La condensación se acumula justo donde no la ves, en la base de la paleta.</p>
<p><strong>Cubrir la leña con una lona hasta el suelo.</strong> Crea un invernadero: la humedad queda atrapada dentro y la madera se pudre en lugar de secarse.</p>
<p><strong>Mezclar leña nueva sobre la vieja.</strong> Consume primero la más antigua; si la entierras bajo la nueva, se degradará sin llegar a usarse.</p>
<p><strong>Apoyar los sacos directamente sobre hormigón.</strong> Es el error más frecuente y el más fácil de evitar: un palé cuesta poco y salva la compra entera.</p>

<h2>Cuánto duran</h2>
<p>Bien almacenados, los pellets no tienen fecha de caducidad: se conservan años sin perder poder calorífico. La leña, en cambio, alcanza su punto óptimo entre los dieciocho meses y los tres años; a partir de ahí empieza a degradarse y a perder densidad.</p>
HTML;
    }
}
