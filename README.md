# spaced-repetition
Repository of my final engineering degree year project

## Memorize implementation

My first attempt in this project was to implement the memorize algorithm, available at [this repository](https://github.com/Networks-Learning/memorize).

The Memorize algorithm uses 2 files as input. The first one is `hlr.duolingo.weights` and the second one is `observation_1k.csv`. 

- `hlr.duolingo.weights` is a file composed of the words, there respective labels, value and ID. For example, the label of the english word `water` is `en:water/water<n><sg>`, it's ID is `c52ab45d4e22ee7580041911159e3c0c` and it's value `0.0756`. The value represent the difficulty of the word to be learned.

- `observation_1k.csv` is a file composed of observations from some users, learning certain words. It consists in user ID, lexeme ID and number of correct answer and of review.

With the data from these 2 files, the memorize algorithm is able to compute the next learning time for each user and each word in a certain amount of time rather quickly.

### Intensity calculation

The intensity in the memorize algorithm represents the intensity of review, and this value is used to calculate the next reviewing time. Here is it's formula :

<img src="http://www.sciweavers.org/tex2img.php?eq=%5Cfrac%7B1%7D%7B%5Csqrt%28q%29%7D%2A%281-e%5E%7B-n_t%2At%7D%29&bc=White&fc=Black&im=jpg&fs=12&ff=arev&edit=0" align="center" border="0" alt="\frac{1}{\sqrt(q)}*(1-e^{-n_t*t})" width="162" height="47" />

This equation uses the exponential memory model, which is one of the three mainly recommended models for long term learning.

The parameter `n_t` is derived from the previous review of the user, and allow more personnalization to the learning.

Q is a predifined parameter. In this equation, it allows to set control over intensity with an external parameter, but it has other uses that I still need to understand.

### Sampler

To calculate the next reviewing time, memorize uses the sampler function, which takes as input the `n_t` value from above, the Q variable and T, which simply reprensents the maximum amount of time over which the next review will not be calculated.

The sampler first calculate the maximum intensity, <img src="http://www.sciweavers.org/tex2img.php?eq=%5Cfrac%7B1%7D%7B%5Csqrt%28q%29%7D&bc=White&fc=Black&im=jpg&fs=12&ff=arev&edit=0" align="center" border="0" alt="\frac{1}{\sqrt(q)}" width="44" height="47" />. This value will be the rate parameter of a random value taken from an exponential distribution. This will be used to calculate the step at which we calculate the intensity and so the reviewing time. That way the steps will follow the exponential model of the memory from above.

The newly calculated intensity ratio-ed by the maximum one will be compared to a random uniform value between 0 and 1. I don't really understand this step but I think it is to bring more disparities to the reviewing times.